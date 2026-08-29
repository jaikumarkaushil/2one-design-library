/*
  Vanilla i18n for the Knowledge-graph explorer (dev/graph.html) — a plain-TS
  page with no React, so it can't use react-i18next. It runs its own i18next
  instance over the SAME dev/i18n/{en,fr}.json resources (graph.* namespace),
  so the graph stays in lockstep with the rest of the showcase and is covered by
  `npm run check:i18n`. Language is the shared `2one-lang` localStorage key, so a
  choice made on any React page carries over here and vice-versa.
*/
import i18next from 'i18next'
import en from './en.json'
import fr from './fr.json'

export type Lang = 'en' | 'fr'
const STORAGE_KEY = '2one-lang'

export function currentLang(): Lang {
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    if (s === 'en' || s === 'fr') return s
  } catch {
    /* storage unavailable — fall back to the browser language */
  }
  return (navigator.language || '').toLowerCase().startsWith('fr') ? 'fr' : 'en'
}

export function setLang(l: Lang) {
  try {
    localStorage.setItem(STORAGE_KEY, l)
  } catch {
    /* best-effort */
  }
}

const instance = i18next.createInstance()
void instance.init({
  resources: { en: { translation: en }, fr: { translation: fr } },
  lng: currentLang(),
  fallbackLng: 'en',
  initImmediate: false, // inline resources → initialise synchronously so gt() is ready
  interpolation: { escapeValue: false },
  returnNull: false,
})

export const gt = (key: string, opts?: Record<string, unknown>): string =>
  instance.t(key, opts) as string
