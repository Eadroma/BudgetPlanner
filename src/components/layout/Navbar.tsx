'use client'

import React from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { LanguageSwitch } from './LanguageSwitch'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import styles from './Navbar.module.css'

interface NavbarProps {
  locale: string
}

/**
 * Navbar — responsabilité unique : afficher la barre de navigation principale
 * avec le logo, les liens contextuels (auth ou nav), et le switch de langue.
 */
export function Navbar({ locale }: NavbarProps) {
  const t = useTranslations('nav')
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) return null

  return (
    <header className={styles.navbar}>
      <nav className={styles.inner} aria-label="Navigation principale">
        <Link href={`/${locale}`} className={styles.brand} aria-label={t('brand')}>
          <span className={styles.brandMark}>⬡</span>
          <span className={styles.brandName}>{t('brand')}</span>
        </Link>

        <div className={styles.right}>
          <LanguageSwitch currentLocale={locale} />
          
          <div className={styles.authLinks}>
            <Link href={`/${locale}/login`} className={styles.loginLink}>
              {t('login')}
            </Link>
            <Link href={`/${locale}/register`}>
              <Button variant="primary" size="sm">{t('register')}</Button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
