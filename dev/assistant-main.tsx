import { createRoot } from 'react-dom/client'
import './theme-dev.css'
import './showcase.css'
import { ThemeProvider } from '../src/theme-provider'
import { AssistantElements } from './assistant'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <AssistantElements />
  </ThemeProvider>,
)
