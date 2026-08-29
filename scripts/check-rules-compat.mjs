/*
  check:rules-compat — a rule may not change meaning in silence.

  The rules contract is a published interface. A consumer installs it, writes
  code against it, and their `2one check` starts or stops firing according to
  what is in this file. Nothing recorded that. Over one working session the
  contract went 1.0.0 → 1.1.0 → 1.2.0, two rules moved category, and four
  detectors changed effective severity — and no consumer had any way to learn
  that any of it happened. Their gate simply began reporting something else.

  That is the same failure as the wordmark rule that never fired: a green whose
  meaning shifted underneath the person reading it.

  So this compares the contract against a BASELINE and fails on a change that a
  consumer would experience as a break, unless the change is declared:

    removed rule          → must appear in the `deprecations` ledger
    severity raised       → must come with a version bump
    category changed      → must come with a version bump (it moves precedence)
    version went backwards → always wrong

  Additions are never breaking and are reported for information only. A
  severity RELAXED is not breaking either — nobody's build starts failing — but
  it is reported, because a rule quietly downgraded from must to should is how
  a standard erodes without a decision.

  Baseline resolution, in order:
    --baseline <ref|path>   explicit; a git ref or a file
    the newest git tag      the last thing anyone could have installed
    origin/<default branch>
    HEAD

  If none resolve it does NOT pass quietly — it says it could not check.

  Run: npm run check:rules-compat
*/
import { readFileSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join } from 'node:path'
import { config as cfg } from './lib/config.mjs'

const root = cfg.root
const rulesPath = cfg.rel('rules')
const args = process.argv.slice(2)
const explicit = args[args.indexOf('--baseline') + 1]
const asJson = args.includes('--json')

/*
  A payload may have no authored rules at all — the Acme fixture does not, and
  `2one init` reports exactly that as an unwritten tier. Running here died with
  a raw ENOENT stack, which reads as a broken tool rather than an absent file.
*/
if (!rulesPath || !existsSync(join(root, rulesPath))) {
  console.log(`\n  – check:rules-compat — NOT CHECKED (${cfg.name} has no rules contract at ${rulesPath ?? 'any configured path'}).`)
  console.log('    Author one before this can tell a revision from a silent change.\n')
  process.exit(0)
}

const git = (...a) => execFileSync('git', ['-C', root, ...a], { encoding: 'utf8' }).trim()
const at = (ref) => { try { return JSON.parse(git('show', `${ref}:${rulesPath}`)) } catch { return null } }

/** Resolve the baseline contract, and say where it came from. */
const baseline = (() => {
  if (explicit && !explicit.startsWith('--')) {
    if (existsSync(explicit)) return { contract: JSON.parse(readFileSync(explicit, 'utf8')), from: explicit }
    const c = at(explicit)
    return c ? { contract: c, from: explicit } : { contract: null, from: explicit, failed: true }
  }
  try {
    // The newest tag is the last state anyone could plausibly have installed.
    const tag = git('describe', '--tags', '--abbrev=0')
    const c = at(tag)
    if (c) return { contract: c, from: `tag ${tag}` }
  } catch { /* no tags */ }
  for (const ref of ['origin/main', 'origin/master', 'HEAD']) {
    const c = at(ref)
    if (c) return { contract: c, from: ref }
  }
  return { contract: null, from: null }
})()

const current = JSON.parse(readFileSync(join(root, rulesPath), 'utf8'))

if (!baseline.contract) {
  /*
    Not an error: a brand-new payload legitimately has no prior version. But it
    must not read as a pass — "nothing to compare" and "compared and fine" are
    different claims, and conflating them is the bug this file exists for.
  */
  const why = baseline.failed ? `baseline "${baseline.from}" could not be read` : 'no tag, remote or prior commit carries this file'
  console.log(`\n  – check:rules-compat — NOT CHECKED (${why}).`)
  console.log('    This is not a pass. Nothing was compared.\n')
  process.exit(0)
}

const semver = (v) => String(v ?? '0.0.0').split('.').map(Number)
const cmp = (a, b) => { const [x, y] = [semver(a), semver(b)]; for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i]; return 0 }

const RANK = ['may', 'avoid', 'should', 'must', 'forbidden']
const rank = (s) => { const i = RANK.indexOf(s); return i === -1 ? 0 : i }

const was = new Map((baseline.contract.rules ?? []).map((r) => [r.id, r]))
const now = new Map((current.rules ?? []).map((r) => [r.id, r]))
const retired = new Set((current.deprecations ?? []).map((d) => d.id))

const bumped = cmp(current.version, baseline.contract.version) > 0
const breaking = []
const notable = []
const added = []

for (const [id, before] of was) {
  const after = now.get(id)
  if (!after) {
    if (!retired.has(id)) {
      breaking.push(`rule "${id}" was REMOVED with no entry in deprecations — every consumer silently stops checking it`)
    } else {
      notable.push(`rule "${id}" retired (declared in deprecations)`)
    }
    continue
  }
  if (rank(after.severity) > rank(before.severity)) {
    const msg = `rule "${id}" severity raised ${before.severity} → ${after.severity} — consumers who passed will now fail`
    bumped ? notable.push(msg) : breaking.push(`${msg}, with no version bump`)
  } else if (rank(after.severity) < rank(before.severity)) {
    notable.push(`rule "${id}" severity RELAXED ${before.severity} → ${after.severity} — the standard moved; was that deliberate?`)
  }
  if (after.category !== before.category) {
    const msg = `rule "${id}" moved category ${before.category} → ${after.category} — this changes which rule wins a conflict`
    bumped ? notable.push(msg) : breaking.push(`${msg}, with no version bump`)
  }
}
for (const id of now.keys()) if (!was.has(id)) added.push(id)

if (cmp(current.version, baseline.contract.version) < 0) {
  breaking.push(`version went BACKWARDS: ${baseline.contract.version} → ${current.version}`)
}
if (!bumped && (breaking.length || notable.length)) {
  breaking.push(`the contract changed but version stayed at ${current.version} — a consumer cannot tell the two apart`)
}

if (asJson) {
  console.log(JSON.stringify({ baseline: baseline.from, from: baseline.contract.version, to: current.version, breaking, notable, added }, null, 2))
} else {
  console.log(`\n  check:rules-compat — ${rulesPath} v${baseline.contract.version} (${baseline.from}) → v${current.version}\n`)
  for (const a of added) console.log(`    + ${a}`)
  for (const n of notable) console.log(`    · ${n}`)
  if (breaking.length) {
    console.error(`\n  ✗ ${breaking.length} undeclared breaking change(s):\n`)
    for (const b of breaking) console.error(`    • ${b}`)
    console.error('\n  Declare them: bump `version`, and record any removal in `deprecations`')
    console.error('  with an id, the version it went in, and a reason.\n')
  } else {
    const n = added.length + notable.length
    console.log(n ? `\n  ✓ ${n} change(s), all declared\n` : '\n  ✓ no change to the rules contract\n')
  }
}

process.exit(breaking.length ? 1 : 0)
