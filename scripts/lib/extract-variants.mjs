/*
  extract-variants — pull the class-variance-authority (cva) variant enums out of
  a component's source, so the manifest can carry the ONE bit of a component's
  contract an agent most often has to open source for: which `variant` / `size`
  (etc.) values exist, and their defaults.

  This is deliberately the mechanical subset of a full prop contract. cva blocks
  are regular — `cva(base, { variants: { <group>: { <option>: "…" } }, defaultVariants: { … } })`
  — so the group names, their option keys, and the defaults extract reliably
  without a TypeScript parse. Full prop types (name/type/required) are a larger,
  AST-shaped job and intentionally out of scope here.

  All STRUCTURE matching runs on a string-stripped copy (so a `{`/`[` inside a
  Tailwind class string never corrupts depth), while key names and default values
  are read from the ORIGINAL at the same offsets — because an option key can be a
  quoted string with a hyphen (`"icon-sm"`) that stripping would blank.

  Returns `{ groups: { <group>: [options] }, defaults: { <group>: value } }` or
  null when the file has no cva variant block. Payload-agnostic; no 2one specifics.
*/

// Replace the CONTENTS of every string/template literal with spaces, preserving
// byte offsets and newlines. Delimiters are kept, so offsets align with the source.
function stripStrings(src) {
  let out = ''
  let quote = null
  for (let i = 0; i < src.length; i++) {
    const c = src[i]
    if (quote) {
      if (c === '\\') { out += '  '; i++; continue }
      if (c === quote) { quote = null; out += c; continue }
      out += c === '\n' ? '\n' : ' '
    } else if (c === "'" || c === '"' || c === '`') {
      quote = c
      out += c
    } else {
      out += c
    }
  }
  return out
}

// Index of the `}` matching the `{` at `open` (both in the stripped string `s`).
function matchBrace(s, open) {
  let depth = 0
  for (let i = open; i < s.length; i++) {
    if (s[i] === '{') depth++
    else if (s[i] === '}' && --depth === 0) return i
  }
  return -1
}

const KEY_RE = /^\s*(?:([A-Za-z_$][\w$]*)|["']([^"']*)["'])\s*:/

// Top-level `key: value` entries of the object literal the strings start with.
// `s` (stripped) drives structure; `orig` (same offsets) supplies real text.
// Object values return `bodyS`/`body` (stripped/original, incl. braces); other
// values return `value` (original source, trimmed).
function topLevelEntries(s, orig) {
  const entries = []
  const start = s.indexOf('{')
  if (start < 0) return entries
  let depth = 0
  for (let i = start; i < s.length; i++) {
    const c = s[i]
    if (c === '{') { depth++; continue }
    if (c === '}') { if (--depth === 0) break; continue }
    if (depth !== 1) continue
    const m = KEY_RE.exec(s.slice(i))
    if (!m) continue
    const real = KEY_RE.exec(orig.slice(i)) // real key name (quoted keys survive here)
    const key = (real && (real[1] ?? real[2])) ?? m[1] ?? m[2]
    let j = i + m[0].length
    while (j < s.length && /\s/.test(s[j])) j++
    if (s[j] === '{') {
      const close = matchBrace(s, j)
      entries.push({ key, bodyS: s.slice(j, close + 1), body: orig.slice(j, close + 1) })
      i = close
    } else {
      let k = j, d = 0
      while (k < s.length) {
        const cc = s[k]
        if (cc === '{' || cc === '[' || cc === '(') d++
        else if (cc === '}' || cc === ']' || cc === ')') { if (d === 0) break; d-- }
        else if (cc === ',' && d === 0) break
        k++
      }
      entries.push({ key, value: orig.slice(j, k).trim() })
      i = k - 1
    }
  }
  return entries
}

export function extractVariants(src) {
  const s = stripStrings(src)
  const cva = s.indexOf('cva(')
  if (cva < 0) return null

  const vAt = s.indexOf('variants:', cva)
  if (vAt < 0) return null
  const vOpen = s.indexOf('{', vAt)
  const vClose = matchBrace(s, vOpen)
  if (vClose < 0) return null

  const groups = {}
  for (const g of topLevelEntries(s.slice(vOpen, vClose + 1), src.slice(vOpen, vClose + 1))) {
    if (g.bodyS) groups[g.key] = topLevelEntries(g.bodyS, g.body).map((o) => o.key)
  }
  if (!Object.keys(groups).length) return null

  const defaults = {}
  const dAt = s.indexOf('defaultVariants:', cva)
  if (dAt >= 0) {
    const dOpen = s.indexOf('{', dAt)
    const dClose = matchBrace(s, dOpen)
    if (dClose > dOpen) {
      for (const d of topLevelEntries(s.slice(dOpen, dClose + 1), src.slice(dOpen, dClose + 1))) {
        if (d.value != null) defaults[d.key] = d.value.replace(/['"]/g, '').trim()
      }
    }
  }
  return { groups, defaults }
}
