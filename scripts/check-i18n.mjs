#!/usr/bin/env node
/*
  check-i18n — keeps the showcase's locales in lockstep.

  The showcase (dev/) ships in English + French. English (en.json) is the
  source of truth; every key in it must exist in every other locale, with a
  non-empty value, the same shape (string vs array vs object), and the same
  interpolation placeholders ({{count}}, {{name}}, …). Runs in `npm run verify`
  so a new English string can never land without its translations.

  Exit 0 = locales in sync. Exit 1 = drift (prints exactly what to fix).
*/
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const i18nDir = join(here, '..', 'dev', 'i18n')

const BASE = 'en'
const LOCALES = ['en', 'fr']

const load = (lang) => JSON.parse(readFileSync(join(i18nDir, `${lang}.json`), 'utf8'))

const placeholders = (s) => (s.match(/\{\{\s*[\w.]+\s*\}\}/g) ?? []).map((p) => p.replace(/\s+/g, '')).sort()
const shapeOf = (v) => (Array.isArray(v) ? 'array' : v === null ? 'null' : typeof v)

/* Walk the base tree, collecting every leaf path with its value + shape. */
function leaves(node, prefix = '', out = []) {
  if (Array.isArray(node) || typeof node !== 'object' || node === null) {
    out.push({ path: prefix, value: node, shape: shapeOf(node) })
    return out
  }
  for (const [k, v] of Object.entries(node)) leaves(v, prefix ? `${prefix}.${k}` : k, out)
  return out
}

function at(node, path) {
  return path.split('.').reduce((acc, k) => (acc == null ? undefined : acc[k]), node)
}

const base = load(BASE)
const baseLeaves = leaves(base)
const problems = []

for (const lang of LOCALES) {
  if (lang === BASE) continue
  const tree = load(lang)

  // Every base leaf must be present, same shape, non-empty, same placeholders.
  for (const { path, value, shape } of baseLeaves) {
    const other = at(tree, path)
    if (other === undefined) {
      problems.push(`[${lang}] MISSING key: ${path}`)
      continue
    }
    const otherShape = shapeOf(other)
    if (otherShape !== shape) {
      problems.push(`[${lang}] SHAPE mismatch at ${path}: en=${shape} ${lang}=${otherShape}`)
      continue
    }
    if (shape === 'string') {
      if (other.trim() === '') problems.push(`[${lang}] EMPTY string: ${path}`)
      const a = placeholders(value)
      const b = placeholders(other)
      if (a.join('|') !== b.join('|')) {
        problems.push(`[${lang}] PLACEHOLDER mismatch at ${path}: en=[${a}] ${lang}=[${b}]`)
      }
    } else if (shape === 'array') {
      if (other.length !== value.length) {
        problems.push(`[${lang}] ARRAY length mismatch at ${path}: en=${value.length} ${lang}=${other.length}`)
      }
      other.forEach((el, i) => {
        if (typeof el === 'string' && el.trim() === '') problems.push(`[${lang}] EMPTY array item: ${path}[${i}]`)
      })
    }
  }

  // Flag keys that exist in the locale but not in the base (stale/typo).
  for (const { path } of leaves(tree)) {
    if (at(base, path) === undefined) problems.push(`[${lang}] EXTRA key not in ${BASE}: ${path}`)
  }
}

if (problems.length) {
  console.error(`✗ i18n locales out of sync (${problems.length} problem${problems.length > 1 ? 's' : ''}):\n`)
  for (const p of problems) console.error('  ' + p)
  console.error(`\nEvery key in dev/i18n/${BASE}.json must exist in ${LOCALES.filter((l) => l !== BASE).join(', ')} with a non-empty value and matching placeholders.`)
  process.exit(1)
}

const count = baseLeaves.length
console.log(`✓ i18n in sync — ${LOCALES.join(' + ')}, ${count} keys each.`)
