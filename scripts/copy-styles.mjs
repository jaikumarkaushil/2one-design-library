/*
  Ships the design tokens as CSS alongside the compiled components.
  Produces dist/styles.css (all @theme blocks, for `import
  '@yokesh-2one/design-library/styles'`) and dist/tokens/*.css (individual files).
*/
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const tokensDir = resolve(root, 'tokens')
const dist = resolve(root, 'dist')
const distTokens = resolve(dist, 'tokens')
mkdirSync(distTokens, { recursive: true })

const files = ['colors.css', 'typography.css', 'spacing.css']
let combined =
  '/* @yokesh-2one/design-library tokens — Tailwind v4 @theme blocks. Import via `@yokesh-2one/design-library/styles`. */\n\n'
for (const f of files) {
  const css = readFileSync(resolve(tokensDir, f), 'utf8')
  combined += css + '\n'
  copyFileSync(resolve(tokensDir, f), resolve(distTokens, f))
}
writeFileSync(resolve(dist, 'styles.css'), combined)
console.log('copy-styles: wrote dist/styles.css and dist/tokens/*.css')
