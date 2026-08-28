/*
  Builds graph.json — the 2one Design System semantic decision graph.

  TWO LAYERS, merged deterministically:
    1. DERIVED (provenance=derived) — parsed from repository source: tokens,
       components, templates, dependencies, contrast facts. Never drifts because
       it is regenerated from the code.
    2. AUTHORED (provenance=explicit) — the decision layer that CANNOT be derived
       from code: intents, contexts, states, accessibility requirements, first-class
       rules with priority/tier, and semantic decision edges (preferred_for,
       preferred_over, inappropriate_for, requires, ...). Lives in graph/decisions.json.

  Every node carries an ontology `class` (see graph/ontology.json) and a `prov`
  (explicit | derived). Every edge is validated against the ontology's domain/range
  and carries its own `prov`, and — for decision edges — a `priority`, optional
  `context`, and a `source` reference. Output is fully deterministic: stable ids,
  sorted nodes and edges, no timestamps.

  Run: npm run graph
*/
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { INTERACTIVE } from './interactive-components.mjs'

import { config as cfg } from './lib/config.mjs'

const root = cfg.root
const R = (p) => readFileSync(join(root, p), 'utf8')
const J = (p) => JSON.parse(R(p))
const ls = (rel, f = () => true) => existsSync(join(root, rel)) ? readdirSync(join(root, rel)).filter(f) : []
const baseName = (f) => f.replace(/\.[^.]+$/, '')

const ontology = J('graph/ontology.json')
const decisions = J('graph/decisions.json')

// ---- ontology helpers: node type -> class, and the authored type set ----
const TYPE_CLASS = {}
for (const [cls, def] of Object.entries(ontology.node_classes)) for (const t of def.node_types) TYPE_CLASS[t] = cls
const classOf = (type) => TYPE_CLASS[type] || 'Unknown'
const AUTHORED_TYPES = new Set(['rule', 'brand', 'persona', 'intent', 'context', 'state', 'a11y', 'pattern', 'variant', 'ai-component'])
const provOfType = (type) => (AUTHORED_TYPES.has(type) ? 'explicit' : 'derived')

const nodes = new Map()
const edges = []
const warnings = []
const addNode = (id, type, label, extra = {}) => {
  if (!nodes.has(id)) nodes.set(id, { id, type, class: classOf(type), prov: provOfType(type), label, ...extra })
}
const addEdge = (source, target, type, prov = 'derived', extra = {}) => {
  if (nodes.has(source) && nodes.has(target)) edges.push({ source, target, type, prov, ...extra })
}

const colors = J('tokens/colors.json')
const type = J('tokens/typography.json')
const space = J('tokens/spacing.json')
const brand = J('brand/brand.json')

// ================= DERIVED LAYER =================

// ---- TOKEN nodes ----
const SEMANTIC = Object.keys(colors.semantic)
for (const k of SEMANTIC) addNode(`token:${k}`, 'token-color', k, { hex: colors.semantic[k] })
for (const [ramp, steps] of Object.entries(colors.ramps))
  for (const [step, hex] of Object.entries(steps)) addNode(`ramp:${ramp}-${step}`, 'ramp', `${ramp}-${step}`, { hex })
for (const k of Object.keys(space.radius)) addNode(`radius:${k}`, 'token-radius', `radius-${k}`, { value: space.radius[k] })
for (const k of Object.keys(type.scale)) addNode(`type:${k}`, 'token-type', `text-${k}`, { px: type.scale[k].size_px })

// derived_from: semantic colour → the ramp step with the same hex
const hexToRamp = {}
for (const [ramp, steps] of Object.entries(colors.ramps)) for (const [step, hex] of Object.entries(steps)) hexToRamp[hex.toLowerCase()] = `ramp:${ramp}-${step}`
for (const k of SEMANTIC) { const r = hexToRamp[(colors.semantic[k] || '').toLowerCase()]; if (r) addEdge(`token:${k}`, r, 'derived_from', 'derived') }

// ---- COMPONENT nodes + composed_of edges (parse the source for token classes) ----
const titleize = (s) => s.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join('')
const componentFiles = [
  ...ls('src/components/ui', (f) => f.endsWith('.tsx')).map((f) => ['component', 'src/components/ui/' + f, baseName(f)]),
  ...ls('src/components', (f) => f.endsWith('.tsx')).map((f) => ['component-2one', 'src/components/' + f, baseName(f)]),
]
const kindByName = new Map(componentFiles.map(([kind, , name]) => [name, kind]))
const compId = (name) => `${kindByName.get(name) === 'component-2one' ? 'component-2one' : 'component'}:${name}`
for (const [kind, path, name] of componentFiles) addNode(compId(name), kind, titleize(name), { path })

const utilRe = (tok) => new RegExp(`\\b(?:bg|text|border|ring|fill|stroke|from|to|via|outline|placeholder|divide|caret|decoration|shadow)-${tok}(?:/\\d+)?\\b`)
for (const [, path, name] of componentFiles) {
  const src = R(path)
  for (const k of SEMANTIC) if (utilRe(k).test(src)) addEdge(compId(name), `token:${k}`, 'composed_of', 'derived')
  if (/\bborder(?:-\d)?\b/.test(src) && !src.match(utilRe('border'))) addEdge(compId(name), 'token:border', 'composed_of', 'derived')
  for (const k of Object.keys(space.radius)) if (new RegExp(`\\brounded-${k}\\b`).test(src)) addEdge(compId(name), `radius:${k}`, 'composed_of', 'derived')
  for (const k of Object.keys(type.scale)) if (new RegExp(`\\btext-${k}\\b`).test(src)) addEdge(compId(name), `type:${k}`, 'composed_of', 'derived')
}
// Button is a pill via the globals.css [data-slot=button] override, not its own class
addEdge('component:button', 'radius:full', 'composed_of', 'derived')

// ---- component → component composition (parse imports of @/components/...) ----
const importedComponents = (src) => {
  const set = new Set()
  for (const m of src.matchAll(/from\s+['"]@\/components\/(?:ui\/)?([a-z0-9-]+)['"]/g)) set.add(m[1])
  return set
}
for (const [, path, name] of componentFiles) {
  for (const c of importedComponents(R(path))) {
    if (c !== name && nodes.has(compId(c))) addEdge(compId(name), compId(c), 'composed_of', 'derived')
  }
}

// ---- DEPENDENCY edges: component → external npm package it imports ----
const PEERS = new Set(['react', 'react-dom'])
const pkgName = (spec) => (spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0])
const externalPackages = (src) => {
  const set = new Set()
  for (const m of src.matchAll(/from\s+['"]([^'"]+)['"]/g)) {
    const spec = m[1]
    if (spec.startsWith('.') || spec.startsWith('@/')) continue
    const pkg = pkgName(spec)
    if (!PEERS.has(pkg)) set.add(pkg)
  }
  return set
}
for (const [, path, name] of componentFiles) {
  for (const pkg of externalPackages(R(path))) {
    const id = `pkg:${pkg}`
    addNode(id, 'package', pkg)
    addEdge(compId(name), id, 'depends_on', 'derived')
  }
}

// ---- TEMPLATE nodes + uses edges ----
const addTemplate = (id, label, ttype, files) => {
  addNode(id, ttype, label)
  const used = new Set()
  for (const f of files) for (const c of importedComponents(R(f))) used.add(c)
  for (const c of used) if (nodes.has(compId(c))) addEdge(id, compId(c), 'uses', 'derived')
}
for (const f of ls('src/blocks', (f) => f.endsWith('.tsx'))) addTemplate(`block:${baseName(f)}`, baseName(f), 'template-block', ['src/blocks/' + f])
if (existsSync(join(root, 'src/blocks/dashboard-plain')))
  addTemplate('block:dashboard-plain', 'dashboard-plain', 'template-block', ls('src/blocks/dashboard-plain', (f) => f.endsWith('.tsx')).map((f) => 'src/blocks/dashboard-plain/' + f))
for (const f of ls('src/blocks/marketing', (f) => f.endsWith('.tsx'))) addTemplate(`block:marketing-${baseName(f)}`, `marketing/${baseName(f)}`, 'template-block', ['src/blocks/marketing/' + f])
for (const f of ls('src/blocks/charts', (f) => f.endsWith('.tsx'))) addTemplate(`chart:${baseName(f)}`, baseName(f), 'template-chart', ['src/blocks/charts/' + f])

// ---- RULE nodes from the authoritative contract rules/ux-rules.json ----
// Fulfils that file's stated contract: each UX rule becomes a `rule:` node with
// governed_by edges. Rule metadata rides along (severity→priority, category→tier,
// statement + rationale as evidence) so the decision engine can reason and cite.
const uxRules = J('rules/ux-rules.json')
const SEV_PRIORITY = { forbidden: 'FORBIDDEN', must: 'MANDATORY', should: 'PREFERRED', may: 'ALLOWED', avoid: 'AVOID' }
const SEV_KIND = { forbidden: 'constraint', must: 'constraint', should: 'guideline', may: 'guideline', avoid: 'antipattern' }
const resolveInteractive = (name) => (nodes.has(`component-2one:${name}`) ? `component-2one:${name}` : `component:${name}`)
const expandTargets = (arr) => (arr || []).flatMap((t) => (t === '@interactive' ? INTERACTIVE.map(resolveInteractive) : [t]))
for (const r of uxRules.rules) {
  addNode(`rule:${r.id}`, 'rule', r.label, {
    kind: SEV_KIND[r.severity] || 'guideline',
    priority: SEV_PRIORITY[r.severity] || 'ALLOWED',
    severity: r.severity, tier: r.category, category: r.category,
    statement: r.statement, rationale: r.rationale, source: 'rules/ux-rules.json',
  })
  for (const t of expandTargets(r.applies_to)) if (nodes.has(t)) addEdge(t, `rule:${r.id}`, 'governed_by', 'explicit')
}

// ---- CONTRAST facts + has_contrast (evidence, prov=derived) ----
for (const p of colors.contrast.pairs) {
  const id = `contrast:${p.name}`
  addNode(id, 'contrast', `${p.name} (Lc ${p.apca_lc})`, { apca_lc: p.apca_lc, wcag_ratio: p.wcag_ratio, passes: p.passes })
  const t = `token:${p.name.includes('primary') ? 'primary-foreground' : p.name.includes('destructive') ? 'destructive' : 'foreground'}`
  if (nodes.has(t)) addEdge(t, id, 'has_contrast', 'derived')
}

// ---- BRAND nodes + embodies (authored, prov=explicit) ----
addNode('brand:mission', 'brand', 'Mission', { value: brand.mission })
addNode('brand:voice', 'brand', 'Voice: ' + brand.voice.descriptors.join(', '))
addNode('brand:tone', 'brand', 'Tone: ' + brand.tone.descriptors.join(', '))
for (const p of brand.personas) addNode(`persona:${p.id}`, 'brand', p.label)
for (const p of brand.personas) addEdge('brand:mission', `persona:${p.id}`, 'serves', 'explicit')
addEdge('brand:voice', 'rule:grayscale', 'embodies', 'explicit')
addEdge('brand:voice', 'rule:brand-accent', 'embodies', 'explicit')
addEdge('brand:voice', 'rule:pill-buttons', 'embodies', 'explicit')
addEdge('brand:voice', 'rule:no-color-alone', 'embodies', 'explicit')
addEdge('brand:voice', 'rule:build-from-library', 'embodies', 'explicit')
addEdge('brand:voice', 'rule:one-container', 'embodies', 'explicit')

// ================= AUTHORED DECISION LAYER (graph/decisions.json) =================

// 1. nodes (intents, contexts, states, a11y requirements, patterns, variants, new rules)
for (const [group, list] of Object.entries(decisions.nodes)) {
  for (const n of list) {
    const { id, label, ...rest } = n
    addNode(id, group, label || id, rest)
  }
}
// specializes edges for variants
for (const v of decisions.nodes.variant || []) if (v.specializes) addEdge(v.id, v.specializes, 'specializes', 'explicit', { evidence: v.source })

// 2. enrich existing (structural) rules with priority/tier/kind/applies_to metadata
const targetEdgeDir = (t, rid) => {
  const cls = nodes.get(t).class
  return (cls === 'Intent' || cls === 'Context')
    ? { s: rid, t, type: 'applies_to' }
    : { s: t, t: rid, type: 'governed_by' }
}
for (const [rid, meta] of Object.entries(decisions.enrich_rules || {})) {
  const node = nodes.get(`rule:${rid}`)
  if (!node) { warnings.push(`enrich_rules: rule:${rid} does not exist`); continue }
  const { applies_to, ...scalar } = meta
  Object.assign(node, scalar)
  for (const t of applies_to || []) {
    if (!nodes.has(t)) { warnings.push(`enrich_rules ${rid}: missing node ${t}`); continue }
    const e = targetEdgeDir(t, `rule:${rid}`)
    addEdge(e.s, e.t, e.type, 'explicit')
  }
}

// 3. new rules' applies_to / applies_when → edges
for (const r of decisions.nodes.rule || []) {
  for (const t of r.applies_to || []) {
    if (!nodes.has(t)) { warnings.push(`rule ${r.id}: applies_to missing node ${t}`); continue }
    const e = targetEdgeDir(t, r.id)
    addEdge(e.s, e.t, e.type, 'explicit')
  }
  if (r.applies_when && nodes.has(r.applies_when)) addEdge(r.id, r.applies_when, 'applies_when', 'explicit')
}

// 4. decision edges
for (const e of decisions.edges) {
  if (!nodes.has(e.source)) { warnings.push(`edge: missing source ${e.source}`); continue }
  if (!nodes.has(e.target)) { warnings.push(`edge: missing target ${e.target}`); continue }
  const extra = {}
  if (e.priority) extra.priority = e.priority
  if (e.applies_when) extra.context = e.applies_when
  if (e.source_ref) extra.evidence = e.source_ref
  addEdge(e.source, e.target, e.type, 'explicit', extra)
}

// ================= ONTOLOGY CONFORMANCE (deterministic warnings) =================
const violations = []
for (const e of edges) {
  const spec = ontology.edge_types[e.type]
  if (!spec) { violations.push(`unknown edge type "${e.type}" (${e.source} → ${e.target})`); continue }
  const sn = nodes.get(e.source), tn = nodes.get(e.target)
  if (!sn || !tn) { violations.push(`dangling ${e.type}: ${e.source} → ${e.target}`); continue }
  const sc = sn.class, tc = tn.class
  if (spec.domain && !spec.domain.includes(sc)) violations.push(`${e.type}: source ${e.source} is ${sc}, not in [${spec.domain}]`)
  if (spec.range && !spec.range.includes(tc)) violations.push(`${e.type}: target ${e.target} is ${tc}, not in [${spec.range}]`)
}

// ================= DETERMINISTIC OUTPUT =================
const nodeArr = [...nodes.values()].sort((a, b) => a.id.localeCompare(b.id))
const edgeArr = edges.sort((a, b) => a.type.localeCompare(b.type) || a.source.localeCompare(b.source) || a.target.localeCompare(b.target))
const count = (arr, key) => arr.reduce((a, x) => ((a[key(x)] = (a[key(x)] || 0) + 1), a), {})
const stats = {
  nodes: nodeArr.length,
  edges: edgeArr.length,
  by_node_type: count(nodeArr, (n) => n.type),
  by_class: count(nodeArr, (n) => n.class),
  by_edge_type: count(edgeArr, (e) => e.type),
  by_provenance: { nodes: count(nodeArr, (n) => n.prov), edges: count(edgeArr, (e) => e.prov) },
  ontology_violations: violations.length,
}

writeFileSync(join(root, 'graph.json'), JSON.stringify({
  name: '2one DLS knowledge graph',
  description: 'Semantic decision graph for the 2one Design System. Two layers: derived (parsed from source) and authored (graph/decisions.json — intents, rules, preferences). Nodes carry an ontology class + provenance; edges carry provenance + decision priority. Reason over it with scripts/graph-decide.mjs. Generated by scripts/build-graph.mjs.',
  generated_for: J('package.json').version,
  ontology: 'graph/ontology.json',
  stats, nodes: nodeArr, edges: edgeArr,
}, null, 2) + '\n')

console.log(`graph.json — ${stats.nodes} nodes, ${stats.edges} edges`)
console.log('  class:', JSON.stringify(stats.by_class))
console.log('  prov :', JSON.stringify(stats.by_provenance))
if (warnings.length) { console.log(`\n  ${warnings.length} authoring warning(s):`); warnings.forEach((w) => console.log('   ! ' + w)) }
if (violations.length) { console.log(`\n  ${violations.length} ontology violation(s) — run npm run graph:validate:`); violations.slice(0, 20).forEach((v) => console.log('   ✗ ' + v)) }
