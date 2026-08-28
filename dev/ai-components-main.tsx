import { createRoot } from 'react-dom/client'
import './theme-dev.css'
import './showcase.css'
import { ThemeProvider } from '../src/theme-provider'
import { AIComponents } from './ai-components'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <AIComponents />
  </ThemeProvider>,
)
