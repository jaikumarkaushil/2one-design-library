import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/*
  Library build for @yokesh-2one/design-library.

  React is external (peer dependency), not bundled. Modules are preserved so
  consumers only pull the components they import, and each output file keeps its
  source path (dist/index.js, dist/components/Button/Button.js, …). Tailwind is
  NOT run here — components ship as class strings the CONSUMER's Tailwind v4
  compiles; tokens ship separately as CSS (see scripts/copy-styles.mjs).
*/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: { entry: 'index.ts' },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: [
        {
          format: 'es',
          dir: 'dist',
          preserveModules: true,
          preserveModulesRoot: '.',
          entryFileNames: '[name].js',
        },
        {
          format: 'cjs',
          dir: 'dist',
          preserveModules: true,
          preserveModulesRoot: '.',
          entryFileNames: '[name].cjs',
          exports: 'named',
        },
      ],
    },
  },
})
