'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { routing } from '@/i18n/routing'
import styles from './LanguageSwitch.module.css'

interface LanguageSwitchProps {
  currentLocale: string
}

/**
 * LanguageSwitch — responsabilité unique : afficher et déclencher le changement de langue.
 */
export function LanguageSwitch({ currentLocale }: LanguageSwitchProps) {
  const router = useRouter()
  const pathname = usePathname()

  function switchLocale(newLocale: string) {
    if (newLocale === currentLocale) return
    // Remplacer le segment locale dans le pathname
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
  }

  return (
    <div className={styles.switch} role="group" aria-label="Language selection">
      {routing.locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          className={[styles.btn, locale === currentLocale ? styles.active : ''].join(' ')}
          aria-pressed={locale === currentLocale}
          aria-label={locale === 'fr' ? 'Français' : 'English'}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
