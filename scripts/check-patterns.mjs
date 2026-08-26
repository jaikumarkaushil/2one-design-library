/*
  Anti-hallucination guard for PAGE PATTERNS (src/patterns + rules/patterns/*.json).

  A pattern is only trustworthy if every part traces to something that actually
  exists in the repo. This fails (exit 1) if a pattern spec:
    - points at a src/patterns file that does not exist,
    - has no `references` block (it must cite a shadcn block, OR shadcn
      primitives + 2one blocks — so it can't quietly invent structure),
    - references a component that is not a real component in the graph, or
    - references a 2one block whose file does not exist.

  Why references matter: shadcn ships canonical blocks for dashboard / sidebar /
  login / signup ONLY (https://ui.shadcn.com/blocks) — there is no pricing or
  marketing block. So a pricing/marketing pattern cannot mirror a shadcn
  template; it must be composed from shadcn PRIMITIVES + 2one blocks and say so.
  Requiring — and validating — that provenance is how the library stays honest.

  Run: npm run check:patterns
*/
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const J = (p) => JSON.parse(readFileSync(join(root, p), 'utf8'))
const ls = (rel) => (existsSync(join(root, rel)) ? readdirSync(join(root, rel)) : [])

const SPEC_DIR = 'rules/patterns'
const specs = ls(SPEC_DIR).filter((f) => f.endsWith('.json'))
const errors = []

// The single source of truth for "what components actually exist": the graph.
const graph = existsSync(join(root, 'graph.json')) ? J('graph.json') : { nodes: [] }
const realComponents = new Set(
  graph.nodes.filter((n) => n.type === 'component' || n.type === 'component-2one').map((n) => n.id.split(':')[1])
)
const blockExists = (b) =>
  existsSync(join(root, 'src/blocks', `${b}.tsx`)) || existsSync(join(root, 'src/blocks', b, 'page.tsx'))

for (const f of specs) {
  const where = `${SPEC_DIR}/${f}`
  let s
  try { s = J(join(SPEC_DIR, f)) } catch (e) { errors.push(`${where}: invalid JSON (${e.message})`); continue }

  if (s.file && !existsSync(join(root, s.file))) errors.push(`${where}: file "${s.file}" does not exist`)

  const r = s.references
  if (!r || typeof r !== 'object') {
    errors.push(`${where}: missing "references" — cite a shadcn block, or shadcn primitives + 2one blocks`)
    continue
  }
  const hasSource =
    r.shadcn_block ||
    (Array.isArray(r.shadcn_primitives) && r.shadcn_primitives.length) ||
    (Array.isArray(r.two_one_blocks) && r.two_one_blocks.length)
  if (!hasSource) errors.push(`${where}: references cites no real source (shadcn_block / shadcn_primitives / two_one_blocks)`)

  // Every referenced/composed component must be a REAL component (hallucination guard).
  const comps = [...(s.composes?.components || []), ...(r.shadcn_primitives || [])]
  for (const c of comps) if (!realComponents.has(c)) errors.push(`${where}: component "${c}" is not a real component in the graph — invented?`)

  // Every referenced 2one block must have a file.
  const blocks = [...(s.composes?.blocks || []), ...(r.two_one_blocks || [])]
  for (const b of blocks) if (!blockExists(b)) errors.push(`${where}: 2one block "${b}" has no file under src/blocks/`)
}

if (errors.length) {
  console.error('\n  ✗ check:patterns — a page pattern references something that does not exist:\n')
  for (const e of errors) console.error(`    • ${e}`)
  console.error('')
  process.exit(1)
}
console.log(`\n  ✓ check:patterns — ${specs.length} pattern(s) grounded: every component + block traces to a real repo source\n`)
