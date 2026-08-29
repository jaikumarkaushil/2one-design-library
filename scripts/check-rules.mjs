/*
  Validates the machine-readable UX-rules contract against schema/rules.schema.json:
   - required fields present and correctly typed, no unknown fields,
   - severity is a declared level and category is a declared precedence bucket,
   - ids unique and well-formed,
   - each applies_to target actually exists as a graph node (typo guard),
     with `@interactive` expanded via the single interactive-components list,
   - lifecycle metadata is coherent (superseded_by points at a real rule).

  The field rules live in the SCHEMA, not here. They used to be duplicated in
  this file, which meant the schema was decorative — it described a shape
  nothing enforced, and could drift from the checker without either complaining.
  This reads the schema and enforces it, so there is one definition.

  No JSON-Schema engine: the repo carries no heavy deps, and the subset the
  contract uses (required / type / pattern / minLength / additionalProperties)
  is small enough to walk directly. Anything outside that subset is ignored
  rather than silently assumed to pass — see UNSUPPORTED below.

  Fails (exit 1) on any violation. Wired into `npm run validate`.

  Run: npm run check:rules
*/
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { INTERACTIVE } from './interactive-components.mjs'
import { config as cfg } from './lib/config.mjs'

const root = cfg.root
const J = (p) => JSON.parse(readFileSync(join(root, p), 'utf8'))

const rulesPath = cfg.rel('rules')
const contract = J(rulesPath)
const errors = []

/*
  The schema is optional. A payload that has not written one is incomplete,
  not invalid — but say so, because "no schema" and "schema passed" must never
  look the same in the output.
*/
const schemaPath = cfg.rel('schemas') ? `${cfg.rel('schemas')}/rules.schema.json` : null
const schema = schemaPath && existsSync(join(root, schemaPath)) ? J(schemaPath) : null

/** The keywords this walker honours. Anything else in the schema is NOT checked. */
const UNSUPPORTED = ['oneOf', 'anyOf', 'allOf', 'not', 'if', 'dependencies', 'patternProperties']

const typeOf = (v) => (Array.isArray(v) ? 'array' : v === null ? 'null' : typeof v)

/** Validate `value` against a schema node. Pushes messages onto `out`. */
function validate(value, node, where, out, defs) {
  if (!node) return
  if (node.$ref) return validate(value, defs[node.$ref.split('/').pop()], where, out, defs)
  for (const k of UNSUPPORTED) {
    if (k in node) out.push(`${where}: schema uses "${k}", which check-rules does not evaluate — the field is UNCHECKED`)
  }
  if (node.type && typeOf(value) !== node.type) {
    out.push(`${where}: expected ${node.type}, got ${typeOf(value)}`)
    return
  }
  if (node.type === 'string') {
    if (node.pattern && !new RegExp(node.pattern).test(value)) out.push(`${where}: "${value}" does not match ${node.pattern}`)
    if (node.minLength && value.length < node.minLength) out.push(`${where}: shorter than ${node.minLength} characters`)
  }
  if (node.type === 'array') {
    if (node.minItems && value.length < node.minItems) out.push(`${where}: needs at least ${node.minItems} item(s)`)
    if (node.items) value.forEach((v, i) => validate(v, node.items, `${where}[${i}]`, out, defs))
  }
  if (node.type === 'object' || node.properties) {
    for (const req of node.required ?? []) {
      if (!(req in (value ?? {}))) out.push(`${where}: missing required "${req}"`)
    }
    if (node.minProperties && Object.keys(value ?? {}).length < node.minProperties) {
      out.push(`${where}: needs at least ${node.minProperties} propert(ies)`)
    }
    for (const [k, v] of Object.entries(value ?? {})) {
      const sub = node.properties?.[k]
      if (!sub) {
        if (node.additionalProperties === false) out.push(`${where}: unknown field "${k}"`)
        else if (typeof node.additionalProperties === 'object') validate(v, node.additionalProperties, `${where}.${k}`, out, defs)
        continue
      }
      validate(v, sub, `${where}.${k}`, out, defs)
    }
  }
}

if (schema) validate(contract, schema, rulesPath, errors, schema.definitions ?? {})

// ---- semantic checks the schema cannot express ----
const SEVERITIES = Object.keys(contract.severity_levels || {})
const CATEGORIES = contract.precedence?.order || []
if (!SEVERITIES.length) errors.push('severity_levels is missing or empty')
if (!CATEGORIES.length) errors.push('precedence.order is missing or empty')

// graph node ids (typo guard for applies_to). @interactive expands to component ids;
// since the graph namespaces payload-authored components separately, resolve each name.
const graphFile = cfg.rel('out.graph')
const graphIds = existsSync(join(root, graphFile)) ? new Set(J(graphFile).nodes.map((n) => n.id)) : null
const ownType = cfg.rules.ownComponentNodeType ?? 'component-own'
const resolveInteractive = (name) =>
  graphIds && graphIds.has(`${ownType}:${name}`) ? `${ownType}:${name}` : `component:${name}`

const ids = new Set((contract.rules || []).map((r) => r?.id).filter(Boolean))
const seen = new Set()
for (const [i, r] of (contract.rules || []).entries()) {
  const where = `rules[${i}]${r?.id ? ` (${r.id})` : ''}`
  if (r?.severity && !SEVERITIES.includes(r.severity)) errors.push(`${where}: unknown severity "${r.severity}"`)
  if (r?.category && !CATEGORIES.includes(r.category)) errors.push(`${where}: unknown category "${r.category}"`)
  if (r?.id) { if (seen.has(r.id)) errors.push(`${where}: duplicate id`); seen.add(r.id) }
  // A pointer to a rule that does not exist sends the reader nowhere.
  if (r?.superseded_by && !ids.has(r.superseded_by)) errors.push(`${where}: superseded_by "${r.superseded_by}" is not a rule in this contract`)

  if (graphIds && Array.isArray(r?.applies_to)) {
    for (const t of r.applies_to) {
      if (contract.target_macros && t in contract.target_macros) continue // macro, expanded at graph-build time
      if (!graphIds.has(t)) errors.push(`${where}: applies_to target "${t}" is not a graph node`)
    }
  }
}

// The deprecation ledger must not point at rules that are still live, and must
// not claim a replacement that does not exist.
for (const [i, d] of (contract.deprecations || []).entries()) {
  const where = `deprecations[${i}] (${d?.id ?? '?'})`
  if (d?.id && ids.has(d.id)) errors.push(`${where}: still present in rules — a rule cannot be both live and retired`)
  if (d?.superseded_by && !ids.has(d.superseded_by)) errors.push(`${where}: superseded_by "${d.superseded_by}" is not a rule in this contract`)
}

// sanity: the @interactive macro must resolve to real nodes (catches a renamed component)
if (graphIds) {
  for (const name of INTERACTIVE) {
    if (!graphIds.has(resolveInteractive(name))) errors.push(`@interactive: component "${name}" is not a graph node`)
  }
}

if (errors.length) {
  console.error('\n  ✗ check:rules — UX-rules contract has problems:\n')
  for (const e of errors) console.error(`    • ${e}`)
  console.error('')
  process.exit(1)
}
const against = schema ? `against ${schemaPath}` : 'NO SCHEMA — field shape unchecked'
console.log(`\n  ✓ check:rules — ${contract.rules.length} rules valid ${against}, v${contract.version}\n`)
