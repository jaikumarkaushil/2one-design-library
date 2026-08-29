import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { LANGS, normalizeLang, type Lang } from './config'

/*
  Language switch — mirrors the ThemeToggle pattern (outline, sm) and sits
  next to it in every page header. Two languages, so it toggles rather than
  opening a menu. The label shows the CURRENT language code; the aria-label
  names the language it switches TO.
*/
export function LanguageToggle({ className = '' }: { className?: string }) {
  const { i18n, t } = useTranslation()
  const current: Lang = normalizeLang(i18n.language)
  const next: Lang = current === 'fr' ? 'en' : 'fr'
  return (
    <Button
      variant="outline"
      size="sm"
      className={className}
      aria-label={t('common.switchLanguageTo', { lang: LANGS[next] })}
      onClick={() => void i18n.changeLanguage(next)}
    >
      <Languages />
      {current.toUpperCase()}
    </Button>
  )
}
