/*
  Integrity guard for ASSISTANT ELEMENTS (src/assistant + rules/assistant/*.json).

  An "element" is a single assistant-interface state (reasoning, a tool call, a
  refusal…) rendered as a composed 2one piece. The concept is inspired by
  assistant-ui's Elements catalogue (https://www.assistant-ui.com/elements) — but
  no code is copied, and this guard is what keeps that honest: every element must
  be grounded in REAL repo sources, obey every DLS rule, and surface its
  assumptions.

  Rule-compliance (tokens, lucide, grayscale, one-primary, …) is enforced by
  `npm run check:usage`, whose default scan includes src/assistant, so an element
  is audited exactly like a block. This guard covers grounding + provenance. It
  fails (exit 1) if an element spec:
    - points at a file/export that does not exist,
    - declares no `assumptions` (creative + demo choices must be surfaced),
    - has no `references` block with a `note` and a `checked_against` source,
    - composes / references a component that is not a real component in the graph,
    - is governed by a rule id that is not a real rule in the graph, or
    - has no matching `element:<name>` node in the graph (spec ↔ graph coverage).

  Atomic elements (a typing indicator, streaming text) legitimately compose no
  shadcn primitive — they are built from tokens only. That is allowed, provided
  the references note says so; grounding is about never INVENTING a source, not
  about forcing composition.

  Run: npm run check:assistant
*/
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { config as cfg } from './lib/config.mjs'

const root = cfg.root
const ls = (abs) => (existsSync(abs) ? readdirSync(abs) : [])

const specDir = cfg.path('assistantSpecs')
const SPEC_REL = cfg.rel('assistantSpecs')
const srcDir = cfg.path('assistant')
const specs = ls(specDir).filter((f) => f.endsWith('.json'))
const errors = []

// The graph is the single source of truth for what components, rules and
// elements actually exist.
const graphPath = cfg.path('out.graph')
const graph = existsSync(graphPath) ? JSON.parse(readFileSync(graphPath, 'utf8')) : { nodes: [] }
const realComponents = new Set(
  graph.nodes.filter((n) => n.type === 'component' || n.type === 'component-2one').map((n) => n.id.split(':')[1])
)
const realRules = new Set(graph.nodes.filter((n) => n.type === 'rule').map((n) => n.id.split(':')[1]))
const realElements = new Set(graph.nodes.filter((n) => n.type === 'element').map((n) => n.id))

// Every element file must have a spec — an undocumented element is invisible to an agent.
const specNames = new Set(specs.map((f) => f.replace(/\.json$/, '')))
for (const f of ls(srcDir).filter((f) => f.endsWith('.tsx'))) {
  const name = f.replace(/\.tsx$/, '')
  if (!specNames.has(name)) errors.push(`${cfg.rel('assistant')}/${f}: no spec at ${SPEC_REL}/${name}.json — every element must be documented`)
}

for (const f of specs) {
  const where = `${SPEC_REL}/${f}`
  let s
  try { s = JSON.parse(readFileSync(join(specDir, f), 'utf8')) } catch (e) { errors.push(`${where}: invalid JSON (${e.message})`); continue }

  // file + export
  if (!s.file || !existsSync(join(root, s.file))) errors.push(`${where}: file "${s.file}" does not exist`)
  else if (s.export && !new RegExp(`\\b(?:function|const)\\s+${s.export}\\b`).test(readFileSync(join(root, s.file), 'utf8')))
    errors.push(`${where}: export "${s.export}" not found in ${s.file}`)

  // spec ↔ graph coverage: the element must be a node in the graph
  if (s.id && !realElements.has(s.id)) errors.push(`${where}: "${s.id}" has no node in the graph — add it to graph/decisions.json (nodes.element)`)

  // creative + demo choices must be surfaced
  if (!Array.isArray(s.assumptions) || !s.assumptions.length)
    errors.push(`${where}: missing "assumptions" — declare the demo/creative choices (simulated streaming, placeholder copy) so they are clarified, not baked in`)

  // provenance: honest grounding, never an invented source
  const r = s.references
  if (!r || typeof r !== 'object') {
    errors.push(`${where}: missing "references" — cite the conceptual source (checked_against) and how it is composed (note)`)
  } else {
    if (!r.note) errors.push(`${where}: references.note is required — say what it composes from and that no code was copied`)
    if (!r.checked_against) errors.push(`${where}: references.checked_against is required — the conceptual reference that was actually checked`)
  }

  // every composed / referenced component must be REAL (hallucination guard)
  const comps = [
    ...(s.composes?.components || []),
    ...((r && r.shadcn_primitives) || []),
    ...((r && r.dls_components) || []),
  ]
  for (const c of comps) if (!realComponents.has(c)) errors.push(`${where}: component "${c}" is not a real component in the graph — invented?`)

  // every governing rule must be REAL
  if (!Array.isArray(s.governed_by) || !s.governed_by.length)
    errors.push(`${where}: missing "governed_by" — name the DLS rules this element must obey`)
  for (const rule of s.governed_by || []) if (!realRules.has(rule)) errors.push(`${where}: rule "${rule}" is not a real rule in the graph`)
}

if (errors.length) {
  console.error('\n  ✗ check:assistant — an element references something that does not exist:\n')
  for (const e of errors) console.error(`    • ${e}`)
  console.error('')
  process.exit(1)
}
console.log(`\n  ✓ check:assistant — ${specs.length} element(s) grounded: every component, rule and graph node traces to a real repo source\n`)
