import { createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import './theme-dev.css'
import './showcase.css'
import { ThemeProvider } from '../src/theme-provider'
import i18n from './i18n/config'
import { Components } from './components'

createRoot(document.getElementById('root')!).render(
  <I18nextProvider i18n={i18n}>
    <ThemeProvider>
      <Components />
    </ThemeProvider>
  </I18nextProvider>,
)
