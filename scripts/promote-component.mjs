/*
  `2one promote <file>` — the path back from a client project into the payload.

  The system permits invention: composing something the library has no primitive
  for — a kanban board, a video scrubber, a tier picker — is expected work, and
  evals/cases/novel-component.pass.tsx exists to prove it stays legal. But
  there was no way for anything invented to come BACK. The payload could own
  components (paths.ownComponents, rules.ownComponentNodeType, and 2one's own
  app-bar / bottom-nav-item / logo prove the slot works), yet nothing ever put
  one there.

  That is fragmentation by construction: every client project drifts away
  permanently because the road only runs one way. "Flexible, not fragmented"
  is precisely the difference between allowing extension and allowing extension
  to RETURN.

  What this does NOT do is decide whether a component deserves promoting. That
  is a judgement about the design system, and it belongs to whoever owns it.
  What it does is make the mechanical part safe and the criteria explicit:
  a component enters the payload only if it passes every rule the payload
  enforces, and it arrives carrying where it came from.

  Usage:
    2one promote <file> [--as <name>] [--from <project>] [--dry-run] [--force]

  Exit: 1 if the component does not qualify, or the target already exists.
*/
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { join, basename, dirname, resolve, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { config as cfg } from './lib/config.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const root = cfg.root
const args = process.argv.slice(2).filter((a) => a !== 'promote')
const flag = (n) => { const i = args.indexOf(`--${n}`); return i === -1 ? null : args[i + 1] }
const has = (n) => args.includes(`--${n}`)
const source = args.find((a) => !a.startsWith('--') && a !== flag('as') && a !== flag('from'))

if (!source) {
  console.error('\n  usage: 2one promote <file> [--as <name>] [--from <project>] [--dry-run] [--force]\n')
  process.exit(2)
}
const srcPath = resolve(process.cwd(), source)
if (!existsSync(srcPath)) {
  console.error(`\n  promote: no such file — ${srcPath}\n`)
  process.exit(2)
}

const kebab = (s) => s.replace(/\.[jt]sx?$/, '').replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/[_\s]+/g, '-').toLowerCase()
const name = kebab(flag('as') ?? basename(srcPath))
const destDir = cfg.path('ownComponents')
const dest = join(destDir, `${name}.tsx`)

/*
  ---- the gate ----

  Passing every rule the payload enforces is the one criterion that can be
  checked rather than argued about, and it is not a low bar: it now covers the
  brand rules, the accessibility rules, and the L4 completeness rules — so a
  component with only a resting state, or one that suppresses its focus ring,
  cannot get in. Warnings do not block; they are printed, because a promotion
  is a good moment to read them.

  Everything else a promotion should arguably require — used in N places, has
  an owner, has a spec — is policy, and inventing thresholds here would just be
  this file having opinions the design system never agreed to.
*/
const check = spawnSync(process.execPath, [join(here, 'check-usage.mjs'), srcPath, '--json'], { cwd: root, encoding: 'utf8' })
let findings
try {
  findings = JSON.parse(check.stdout).findings ?? []
} catch {
  console.error(`\n  promote: could not run the rule check —\n  ${(check.stderr || check.stdout || '').trim().split('\n').slice(-3).join('\n  ')}\n`)
  process.exit(1)
}
const errors = findings.filter((f) => f.severity === 'error')
const warnings = findings.filter((f) => f.severity !== 'error')

console.log(`\n  promote ${relative(process.cwd(), srcPath).split(sep).join('/')} → ${cfg.rel('ownComponents')}/${name}.tsx\n`)

if (errors.length) {
  console.error(`  ✗ does not qualify — ${errors.length} rule violation(s):\n`)
  for (const e of errors) console.error(`    ${String(e.line).padStart(4)}  ${e.rule}  —  ${e.detail}`)
  console.error('\n  A component entering the payload is one every future project inherits.')
  console.error('  Fix these in place, then promote.\n')
  process.exit(1)
}
for (const w of warnings) console.log(`    warn  ${String(w.line).padStart(4)}  ${w.rule}  —  ${w.detail}`)
console.log(`  ✓ passes every rule ${cfg.name} enforces${warnings.length ? ` (${warnings.length} warning(s) above)` : ''}`)

if (existsSync(dest) && !has('force')) {
  console.error(`\n  ✗ ${cfg.rel('ownComponents')}/${name}.tsx already exists. Choose another --as name, or --force to replace.\n`)
  process.exit(1)
}

/*
  Provenance in the file itself, not a side ledger. The graph is DERIVED from
  source, so anything kept elsewhere can drift out of sync with the component
  it describes; a header cannot. It also answers the question that actually
  gets asked about an unfamiliar component two years later — where did this
  come from, and who wanted it.
*/
const origin = flag('from') ?? (() => {
  try { return JSON.parse(readFileSync(join(dirname(srcPath), '..', 'package.json'), 'utf8')).name } catch { return null }
})()
const header = [
  '/*',
  `  Promoted into ${cfg.name} from ${origin ?? 'a client project'}${flag('from') ? '' : ' (origin not declared — pass --from next time)'}.`,
  '',
  '  It entered the payload by passing every rule the system enforces, which is',
  '  the only criterion a script can check. Whether it EARNS its place — that it',
  '  is general, named right, and worth every future project inheriting — was a',
  '  judgement someone made, not something this header can vouch for.',
  '*/',
  '',
].join('\n')

if (has('dry-run')) {
  console.log(`\n  --dry-run — would write ${cfg.rel('ownComponents')}/${name}.tsx with this header:\n`)
  console.log(header.split('\n').map((l) => `  ${l}`).join('\n'))
} else {
  mkdirSync(destDir, { recursive: true })
  writeFileSync(dest, header + readFileSync(srcPath, 'utf8'))
  console.log(`  ✓ wrote ${cfg.rel('ownComponents')}/${name}.tsx`)
}

/*
  Deliberately NOT automated: the barrel edit and the graph rebuild.

  Adding an export means guessing this payload's barrel conventions — ordering,
  grouping, type re-exports — and a wrong guess is a merge conflict in the one
  file every consumer imports through. The graph rebuild is a generated-file
  change that belongs in the same commit as a human's review of the component,
  not in a script's side effects.
*/
const barrel = cfg.rel('barrel')
console.log('\n  to finish:')
if (barrel) console.log(`    1. export it from ${barrel}:  export * from './${cfg.rel('ownComponents').replace(/^src\//, '')}/${name}'`)
console.log(`    ${barrel ? 2 : 1}. npm run graph        → it becomes ${cfg.rules.ownComponentNodeType ?? 'component-own'}:${name}`)
console.log(`    ${barrel ? 3 : 2}. npm run verify`)
console.log('')

/*
  A last, honest word. This checks conformance, not worth. The commonest way a
  design system rots is not an off-brand component — it is fifty conforming
  ones nobody needed.
*/
const owned = existsSync(destDir) ? readdirSync(destDir).filter((f) => f.endsWith('.tsx')).length : 0
if (owned >= 12) {
  console.log(`  note: ${cfg.name} now owns ${owned} components beyond the vendored set.`)
  console.log('  Worth asking which of them are still earning their place.\n')
}
