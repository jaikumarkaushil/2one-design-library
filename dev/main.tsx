import { createRoot } from 'react-dom/client'
import './theme-dev.css'
import './showcase.css'
import { ThemeProvider } from '../src/theme-provider'
import { Showcase } from './showcase'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <Showcase />
  </ThemeProvider>,
)
