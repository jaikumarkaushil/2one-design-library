/*
  Validates the machine-readable UX-rules contract (rules/ux-rules.json):
   - every rule has the required fields,
   - severity is a declared level and category is a declared precedence bucket,
   - ids are unique,
   - each applies_to target actually exists as a graph node (typo guard),
     with `@interactive` expanded via the single interactive-components list.
  Fails (exit 1) on any violation. Wired into `npm run validate`.

  Run: npm run check:rules
*/
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { INTERACTIVE } from './interactive-components.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const J = (p) => JSON.parse(readFileSync(join(root, p), 'utf8'))

const contract = J('rules/ux-rules.json')
const errors = []

const SEVERITIES = Object.keys(contract.severity_levels || {})
const CATEGORIES = contract.precedence?.order || []
if (!SEVERITIES.length) errors.push('severity_levels is missing or empty')
if (!CATEGORIES.length) errors.push('precedence.order is missing or empty')

// graph node ids (typo guard for applies_to). @interactive expands to component ids;
// since the graph namespaces 2one-only components separately, resolve each name.
const graphIds = existsSync(join(root, 'graph.json')) ? new Set(J('graph.json').nodes.map((n) => n.id)) : null
const resolveInteractive = (name) =>
  graphIds && graphIds.has(`component-2one:${name}`) ? `component-2one:${name}` : `component:${name}`

const seen = new Set()
for (const [i, r] of (contract.rules || []).entries()) {
  const where = `rules[${i}]${r?.id ? ` (${r.id})` : ''}`
  for (const f of ['id', 'category', 'severity', 'label', 'statement', 'rationale']) {
    if (!r?.[f] || typeof r[f] !== 'string') errors.push(`${where}: missing/invalid "${f}"`)
  }
  if (!Array.isArray(r?.applies_to)) errors.push(`${where}: "applies_to" must be an array`)
  if (r?.severity && !SEVERITIES.includes(r.severity)) errors.push(`${where}: unknown severity "${r.severity}"`)
  if (r?.category && !CATEGORIES.includes(r.category)) errors.push(`${where}: unknown category "${r.category}"`)
  if (r?.id) { if (seen.has(r.id)) errors.push(`${where}: duplicate id`); seen.add(r.id) }

  // target existence (only when the graph is present)
  if (graphIds && Array.isArray(r?.applies_to)) {
    for (const t of r.applies_to) {
      if (t === '@interactive') continue // macro, expanded at graph-build time
      if (!graphIds.has(t)) errors.push(`${where}: applies_to target "${t}" is not a graph node`)
    }
  }
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
console.log(`\n  ✓ check:rules — ${contract.rules.length} UX rules valid (severity + category + targets)\n`)
