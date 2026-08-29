/*
  i18n bootstrap for the showcase (dev/) — English + French.

  The showcase is a MULTI-PAGE Vite app: every page (index / components /
  ai-components / dls) is its own document with its own React root, so the
  language choice cannot live in React state alone — it is persisted to
  localStorage and re-read on every page load. Each *-main.tsx entry imports
  this module for its side effect (init) before rendering.
*/
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import fr from './fr.json'

export const LANGS = { en: 'English', fr: 'Français' } as const
export type Lang = keyof typeof LANGS
export const LANG_ORDER: Lang[] = ['en', 'fr']

const STORAGE_KEY = '2one-lang'

export function normalizeLang(value: string | null | undefined): Lang {
  return value && value.toLowerCase().startsWith('fr') ? 'fr' : 'en'
}

function initialLang(): Lang {
  if (typeof window === 'undefined') return 'en'
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'fr') return saved
  } catch {
    /* private mode / disabled storage — fall through to the browser default */
  }
  return normalizeLang(window.navigator?.language)
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
  },
  lng: initialLang(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false }, // React already escapes
  returnNull: false,
})

// Keep <html lang> honest and persist the choice across the multi-page app.
if (typeof document !== 'undefined') {
  document.documentElement.lang = normalizeLang(i18n.language)
  i18n.on('languageChanged', (lng) => {
    const lang = normalizeLang(lng)
    document.documentElement.lang = lang
    try {
      window.localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* ignore — persistence is best-effort */
    }
  })
}

export default i18n
