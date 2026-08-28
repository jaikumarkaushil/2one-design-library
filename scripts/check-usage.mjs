/*
  check-usage — audits generated or hand-written UI code against a design
  system's rules. ENGINE: the rule MECHANISMS live here; the values they test
  against (wordmark, icon library, own ramps, spacing base) come from
  dls.config.json, so the same checks work for any payload.

  The other checks in this repo verify the SYSTEM (tokens valid, contrast passes,
  generated files in sync). This one verifies OUTPUT: code someone — or some
  model — wrote while using the system. That is the gap the manifest cannot
  close on its own, because a document can only prevent mistakes an agent chose
  to read.

  Every rule here already exists in prose in docs/building-with-the-dls.md or
  brand/logo/manifest.json. This turns them from advisory into checkable.

  Usage:
    node scripts/check-usage.mjs <file|dir> [...]     # defaults to the payload's blocks
    node scripts/check-usage.mjs --json <file>        # machine-readable
    node scripts/check-usage.mjs --warnings <file>    # warnings fail too

  Exit code: 1 if any error-severity finding (or any finding with --warnings).
*/
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative, extname } from 'node:path'
import { config as cfg } from './lib/config.mjs'

const root = cfg.root
const args = process.argv.slice(2)
const asJson = args.includes('--json')
const strict = args.includes('--warnings')
const targets = args.filter((a) => !a.startsWith('--'))

/*
  The knowledge graph is the authority on which tokens exist. Without it this
  file can only catch tokens from OTHER systems (bg-blue-500) — it cannot catch
  an invented 2one-shaped one. `bg-muted-strong` and `text-surface-elevated`
  look exactly like this system's vocabulary, are entirely fictional, and passed
  every check until graph.json was consulted. That is the failure mode a model
  actually has: not reaching for Bootstrap, but confidently inventing a token
  that sounds like yours.
*/
const graph = (() => {
  for (const p of [join(root, cfg.rel('out.graph')), join(root, '..', 'graph.json')]) {
    try { return JSON.parse(readFileSync(p, 'utf8')) } catch { /* try next */ }
  }
  return null
})()

// The specifier a consumer imports from. Payload-declared; without it the
// unknown-import rule has no idea which imports are the system's own.
const PKG_SPECIFIER = cfg.packageName ?? null

/*
  The package's public API, for the unknown-import rule. Read from the manifest
  because the source tree does not ship to a consumer — see build-manifest.
*/
const knownExports = (() => {
  for (const p of [join(root, cfg.rel('out.manifest')), join(root, '..', 'manifest.json')]) {
    try {
      const list = JSON.parse(readFileSync(p, 'utf8'))?.index?.components?.exports
      if (Array.isArray(list) && list.length) return new Set(list)
    } catch { /* try next */ }
  }
  return null // absent → the rule stays silent rather than guessing
})()

// The payload's own ramp names, read from its generated tokens. Needed because
// Tailwind's stock palette list overlaps with plausible ramp names — a payload
// whose primary ramp is called `slate` would have had its entire palette
// reported as a foreign hue by a hardcoded list.
const ownRamps = (() => {
  try {
    const c = JSON.parse(readFileSync(join(cfg.path('out.tokens'), 'colors.json'), 'utf8'))
    return new Set(Object.keys(c.ramps ?? {}))
  } catch { return new Set() }
})()

const knownTokens = new Set()
if (graph) {
  for (const n of graph.nodes) {
    if (n.type === 'token-color') knownTokens.add(n.label)          // primary, muted-foreground …
    if (n.type === 'ramp') knownTokens.add(n.label)                  // neutral-250, danger-700 …
    if (n.type === 'token-radius') knownTokens.add(n.label.replace(/^radius-/, ''))
  }
}

// Tailwind literals and utility keywords that share a prefix with colour utilities
// but are not tokens. Without these the rule drowns in false positives.
const NON_TOKEN = new Set([
  'transparent', 'current', 'inherit', 'white', 'black', 'none', 'auto', 'clip', 'ellipsis',
  'left', 'center', 'right', 'justify', 'start', 'end', 'top', 'bottom', 'balance', 'pretty',
  'wrap', 'nowrap', 'solid', 'dashed', 'dotted', 'double', 'hidden', 'collapse', 'separate',
  'xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl',
  'display', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'full', 'md',
])

// Tailwind's stock palettes, minus any the payload has actually adopted as its
// own ramp. Whatever remains is a second palette by definition.
const TAILWIND_HUES = [
  'slate', 'gray', 'zinc', 'stone', 'red', 'orange', 'amber', 'yellow', 'lime', 'green',
  'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose',
]
const FOREIGN_HUES = TAILWIND_HUES.filter((h) => !ownRamps.has(h)).join('|')

// Every icon package except the one this payload sanctioned. Listing the
// forbidden ones by hand meant the sanctioned library had to be lucide.
const ICON_PACKAGES = [
  'lucide-react', '@tabler/icons-react', 'react-icons', '@heroicons/react',
  '@fortawesome/react-fontawesome', '@radix-ui/react-icons', '@phosphor-icons/react', 'phosphor-react',
]
const OWN_ICONS = cfg.rules.iconLibrary
const FOREIGN_ICONS = new RegExp(
  `from\\s+['"](${ICON_PACKAGES.filter((p) => p !== OWN_ICONS).map((p) => p.replace(/[/@.]/g, '\\$&')).join('|')})`
)

// The mark this payload protects. Hardcoding "2one" meant the rule was inert
// for every other design system.
const WORDMARK = cfg.rules.wordmark ?? cfg.name
const SPACING_BASE = cfg.rules.spacingBase ?? 4

/** @type {{id:string,severity:'error'|'warn',test:(ctx:any)=>{line:number,detail:string}[]}[]} */
const RULES = [
  {
    id: 'hardcoded-color',
    severity: 'error',
    why: 'Hard-coded colour drifts from the tokens and breaks re-theming. Use the semantic utilities (bg-primary, text-muted-foreground, border).',
    test: ({ lines }) =>
      lines.flatMap((l, i) =>
        // hex in a className or style, but not inside an SVG path/fill of a brand asset
        [...l.matchAll(/#[0-9a-fA-F]{3,8}\b/g)]
          .filter(() => !/\.svg|viewBox|d="M/.test(l))
          .map((m) => ({ line: i + 1, detail: `hard-coded ${m[0]}` }))
      ),
  },
  {
    id: 'foreign-palette',
    severity: 'error',
    why: `Only this system's own ramps (${[...ownRamps].join(', ') || 'none declared'}) may be used. Any other palette is a second palette by definition.`,
    test: ({ lines }) =>
      lines.flatMap((l, i) =>
        [...l.matchAll(new RegExp(`\\b(?:bg|text|border|ring|fill|stroke|from|to|via)-(?:${FOREIGN_HUES})-\\d{2,3}\\b`, 'g'))].map(
          (m) => ({ line: i + 1, detail: `${m[0]} introduces a hue outside the system` })
        )
      ),
  },
  {
    id: 'invented-token',
    severity: 'error',
    why: 'This token does not exist in the system. Check graph.json or tokens/colors.json for the real name — a plausible-sounding token silently renders as nothing.',
    test: ({ lines }) => {
      if (!graph) return [] // graph unavailable — stay silent rather than guess
      return lines.flatMap((l, i) =>
        [...l.matchAll(/\b(?:bg|text|border|ring|fill|stroke|outline|divide|placeholder|caret|decoration)-([a-z][a-z0-9]*(?:-[a-z0-9]+)*)\b/g)]
          // Tailwind puts modifiers between the prefix and the colour:
          // ring-offset-background, border-l-transparent, divide-y-border.
          // Strip them so the check sees the colour name itself.
          .map((m) => m[1].replace(/^(?:offset-|[btlrxyse]-(?=\D))/, ''))
          .filter((name) => {
            if (knownTokens.has(name) || NON_TOKEN.has(name)) return false
            if (new RegExp(`^(?:${FOREIGN_HUES})(?:-\\d{2,3})?$`).test(name)) return false // its own rule
            if (/^\d/.test(name) || /\[/.test(name)) return false                          // border-2, arbitrary
            if (/^[btlrxyse](?:-\d+)?$/.test(name)) return false                           // border-b, border-t-0
            if (/^gradient-/.test(name)) return false                                      // bg-gradient-to-r
            if (name.length < 3) return false
            // Only names shaped like this system's semantic tokens. A real but
            // unlisted single word would be missed; the alternative is drowning
            // the report in Tailwind's own utility vocabulary, which gets the
            // check switched off entirely.
            return /-/.test(name)
          })
          .map((name) => ({ line: i + 1, detail: `"${name}" is not a token in this system` }))
      )
    },
  },
  /*
    Deliberately narrow: this flags a named import FROM THE PACKAGE that the
    package does not export, and nothing else.

    Composing something the library has no primitive for — a kanban board, a
    wizard, a heatmap — is legitimate and expected work, and the other ten rules
    already hold it to the brand: its colours, tokens, icons, spacing, wordmark
    and container pattern are all checked whether or not the thing itself is
    novel. Flagging invention as such would break the one behaviour this system
    most needs to allow.

    What is never legitimate is `import { DataGrid } from '@2one/design-library'`
    when no DataGrid exists. That is not creativity, it is a build error the
    author has not hit yet — and the likeliest next step is hand-rolling a
    parallel component off-system. Locally defined components and relative
    imports are untouched.
  */
  {
    id: 'unknown-import',
    severity: 'error',
    why: `Imported from ${PKG_SPECIFIER ?? 'the design system package'}, which does not export it. Compose it from real primitives instead — building it locally is fine, importing something that does not exist is a build error.`,
    test: ({ src }) => {
      if (!knownExports || !PKG_SPECIFIER) return []
      const out = []
      /*
        Blank out comments first. theme-provider.tsx documents its own usage in
        a JSDoc block — `* import { ThemeProvider } from '<pkg>'` — and the
        first version read that example as a real import. Replacing comment
        bodies with spaces rather than deleting them keeps every byte offset
        intact, so reported line numbers still point at the real source.
      */
      const blank = (s) => s.replace(/[^\n]/g, ' ')
      src = src
        .replace(/\/\*[\s\S]*?\*\//g, blank)
        .replace(/(^|[^:])\/\/[^\n]*/g, (m, p) => p + blank(m.slice(p.length)))
      // `import { A, B as C } from '<pkg>'` — value imports only; `import type`
      // is a types question and not this rule's business.
      const re = new RegExp(`import\\s+(?!type\\b)\\{([^}]*)\\}\\s*from\\s*['"]${PKG_SPECIFIER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'g')
      for (const m of src.matchAll(re)) {
        const line = src.slice(0, m.index).split('\n').length
        for (const part of m[1].split(',')) {
          const raw = part.trim()
          if (!raw || raw.startsWith('type ')) continue
          const name = raw.split(/\s+as\s+/)[0].trim()
          if (!name || !/^[A-Za-z_$][\w$]*$/.test(name)) continue
          if (!knownExports.has(name)) out.push({ line, detail: `"${name}" is not exported by the package` })
        }
      }
      return out
    },
  },
  {
    id: 'foreign-icons',
    severity: 'error',
    why: `${OWN_ICONS} only. A second icon set is one of the most visible "AI-generated" tells.`,
    test: ({ lines }) =>
      lines.flatMap((l, i) => (FOREIGN_ICONS.test(l) ? [{ line: i + 1, detail: l.trim().slice(0, 80) }] : [])),
  },
  {
    id: 'typeset-wordmark',
    severity: 'error',
    why: 'The wordmark is an asset, never type. Import Logo (React) or inline brand/logo/svg/*.svg.',
    test: ({ src, lines }) => {
      if (/from\s+['"][^'"]*\/logo['"]|<Logo\b/.test(src)) return []
      return lines.flatMap((l, i) =>
        // The wordmark as the entire VISIBLE text of an element. sr-only text is the
        // accessible name for a logo link — correct practice, not a violation;
        // the placeholder-brand-mark rule below is what catches that case.
        /\bsr-only\b/.test(l)
          ? []
          : [...l.matchAll(new RegExp(`>\s*${WORDMARK}\s*<`, 'gi'))].map((m) => ({
              line: i + 1,
              detail: `"${m[0].trim()}" — wordmark typeset as text`,
            }))
      )
    },
  },
  {
    id: 'placeholder-brand-mark',
    severity: 'error',
    why: `A brand slot exists (sr-only "${WORDMARK}" or aria-label) but the real mark is absent — a generic icon is standing in for the wordmark. Import the Logo component.`,
    test: ({ src, lines }) => {
      if (/from\s+['"][^'"]*\/logo['"]|<Logo\b/.test(src)) return []
      return lines.flatMap((l, i) =>
        new RegExp(`(?:sr-only[^>]*>\s*${WORDMARK}\s*<|aria-label\s*=\s*["']${WORDMARK}["'])`, 'i').test(l)
          ? [{ line: i + 1, detail: `brand slot labelled "${WORDMARK}" but no Logo component in this file` }]
          : []
      )
    },
  },
  {
    id: 'multiple-primary-buttons',
    severity: 'error',
    why: 'One primary action per view. Pair a secondary/outline with it for lesser actions.',
    test: ({ src }) => {
      const opens = [...src.matchAll(/<Button\b([^>]*)>/g)]
      const primaries = opens.filter((m) => !/variant\s*=/.test(m[1]) || /variant\s*=\s*["{]?['"]?default/.test(m[1]))
      if (primaries.length <= 1) return []
      const line = (idx) => src.slice(0, idx).split('\n').length
      return primaries.slice(1).map((m) => ({
        line: line(m.index),
        detail: `${primaries.length} primary Buttons in this view — only one may be primary`,
      }))
    },
  },
  {
    id: 'inline-spacing',
    severity: 'warn',
    why: 'One 8px spacing scale via Tailwind utilities. Ad-hoc inline margins are the most visible inconsistency tell (rule 3).',
    test: ({ lines }) =>
      lines.flatMap((l, i) =>
        [...l.matchAll(/style=\{\{[^}]*\b(margin|padding|gap)[A-Za-z]*\s*:/g)].map((m) => ({
          line: i + 1,
          detail: `inline ${m[1]} — use the spacing scale`,
        }))
      ),
  },
  {
    id: 'off-scale-spacing',
    severity: 'warn',
    why: `Arbitrary spacing values sit off the ${SPACING_BASE}px scale. Prefer a scale step (gap-4, p-6).`,
    test: ({ lines }) =>
      lines.flatMap((l, i) =>
        [...l.matchAll(/\b(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|space-[xy])-\[(\d+)px\]/g)]
          .filter((m) => Number(m[1]) % SPACING_BASE !== 0)
          .map((m) => ({ line: i + 1, detail: `${m[0]} is off the 4/8px scale` }))
      ),
  },
  {
    id: 'handrolled-card',
    severity: 'warn',
    why: 'Every panel is a real Card — same border, radius, padding, shadow (rule 4). Do not build a parallel container.',
    test: ({ lines }) =>
      lines.flatMap((l, i) => {
        if (!/<div\b/.test(l)) return []
        const hasBorder = /\bborder\b/.test(l)
        const hasRadius = /\brounded-(?:lg|xl|2xl)\b/.test(l)
        const hasSurface = /\bbg-(?:card|background|white)\b/.test(l) || /\bshadow-/.test(l)
        return hasBorder && hasRadius && hasSurface
          ? [{ line: i + 1, detail: 'div styled as a card — use <Card> instead' }]
          : []
      }),
  },
  {
    id: 'color-only-state',
    severity: 'warn',
    why: 'Never signal state by colour alone — pair with an icon or text, plus aria-invalid (rule 5, non-negotiable).',
    test: ({ src, lines }) => {
      const hasSignal = /aria-invalid|aria-describedby|FieldError|role=["']alert["']/.test(src)
      if (hasSignal) return []
      return lines.flatMap((l, i) =>
        /\b(?:border|text|ring)-destructive\b/.test(l)
          ? [{ line: i + 1, detail: 'destructive styling with no aria-invalid / error text nearby' }]
          : []
      )
    },
  },
]

// ---- collect files ----
const CODE = new Set(['.tsx', '.jsx', '.ts', '.js', '.html'])
const walk = (p, acc = []) => {
  const s = statSync(p)
  if (s.isDirectory()) {
    for (const f of readdirSync(p)) if (f !== 'node_modules' && !f.startsWith('.')) walk(join(p, f), acc)
  } else if (CODE.has(extname(p))) acc.push(p)
  return acc
}

/*
  A user-supplied target ("npx 2one check src") is a CLI path argument, like
  eslint's or tsc's — relative to where the command was RUN, not to the
  resolved payload root. The two are the same directory in every scenario this
  engine was tested against: inside the 2one repo, and inside the Acme fixture
  (spawned with cwd === the fixture's own root, which owns a dls.config.json).
  Neither exercises the actual distributed case — a consumer with no
  dls.config.json of their own, where `root` silently falls back to the
  installed package's directory inside node_modules — so `check src` resolved
  to node_modules/@2one/design-library/src, which is never shipped, and died
  with a raw ENOENT instead of the checker ever running.
  The unconfigured default (no target given) is the one exception: it names
  the payload's OWN blocks directory, so it belongs against `root`.
*/
const resolveTarget = (t) => (t.startsWith('/') || /^[A-Za-z]:/.test(t) ? t : join(process.cwd(), t))
const inputs = targets.length
  ? targets.map(resolveTarget)
  : [join(root, cfg.rel('blocks')), join(root, cfg.rel('assistant'))].filter((d) => existsSync(d))

const files = inputs.flatMap((p) => {
  try {
    return walk(p)
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.error(`\n  check-usage: no such file or directory: ${p}\n`)
      process.exit(1)
    }
    throw e
  }
})

// ---- run ----
const findings = []
for (const file of files) {
  const src = readFileSync(file, 'utf8')
  const lines = src.split('\n')
  for (const rule of RULES) {
    for (const hit of rule.test({ src, lines })) {
      findings.push({
        file: relative(root, file).replace(/\\/g, '/'),
        line: hit.line,
        rule: rule.id,
        severity: rule.severity,
        detail: hit.detail,
        why: rule.why,
      })
    }
  }
}

const errors = findings.filter((f) => f.severity === 'error')
const warns = findings.filter((f) => f.severity === 'warn')

if (asJson) {
  console.log(JSON.stringify({ scanned: files.length, errors: errors.length, warnings: warns.length, findings }, null, 2))
} else {
  console.log(`\n  check-usage — ${files.length} file(s) scanned against the ${cfg.name} rules\n`)
  if (!findings.length) {
    console.log('  ✓ no violations\n')
  } else {
    let current = ''
    for (const f of [...errors, ...warns]) {
      if (f.file !== current) {
        current = f.file
        console.log(`  ${f.file}`)
      }
      const tag = f.severity === 'error' ? 'error' : 'warn '
      console.log(`    ${tag}  ${String(f.line).padStart(4)}  ${f.rule}  —  ${f.detail}`)
      console.log(`                 ${f.why}`)
    }
    console.log(`\n  ${errors.length} error(s), ${warns.length} warning(s)\n`)
  }
}

process.exit(errors.length || (strict && warns.length) ? 1 : 0)
