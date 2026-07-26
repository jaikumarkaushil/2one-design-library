import type { StorybookConfig } from '@storybook/react-vite'
import tailwindcss from '@tailwindcss/vite'

const config: StorybookConfig = {
  stories: ['../components/**/*.stories.tsx'],
  framework: { name: '@storybook/react-vite', options: {} },
  viteFinal: async (cfg) => {
    cfg.plugins = cfg.plugins ?? []
    cfg.plugins.push(tailwindcss())
    // The root vite.config.ts is a library build; clear those options so
    // Storybook bundles the catalog app normally.
    if (cfg.build) {
      delete (cfg.build as Record<string, unknown>).lib
      delete (cfg.build as Record<string, unknown>).rollupOptions
    }
    return cfg
  },
}
export default config
