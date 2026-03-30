'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { LayoutDashboard, ArrowRightLeft, Settings, LogOut, Plus } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { LanguageSwitch } from './LanguageSwitch'
import styles from './Sidebar.module.css'

interface SidebarProps {
  locale: string
}

export function Sidebar({ locale }: SidebarProps) {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const { user, isAuthenticated, signOut } = useAuth()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    if (user?.email) {
      const email = user.email.trim().toLowerCase()
      const encode = new TextEncoder().encode(email)
      crypto.subtle.digest('SHA-256', encode).then(buffer => {
        const hash = Array.from(new Uint8Array(buffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')
        setAvatarUrl(`https://gravatar.com/avatar/${hash}?s=40&d=identicon`)
      })
    }
  }, [user?.email])

  if (!isAuthenticated) return null

  const isActive = (path: string) => pathname.startsWith(`/${locale}${path}`)

  return (
    <aside className={styles.sidebar}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>⬡</span>
          <span className={styles.brandName}>Echelon</span>
        </div>
      </div>

      <nav className={styles.nav}>
        <Link
          href={`/${locale}/dashboard`}
          className={`${styles.navItem} ${isActive('/dashboard') ? styles.active : ''}`}
        >
          <LayoutDashboard className={styles.icon} size={20} />
          <span>{t('dashboard')}</span>
        </Link>
        <Link
          href={`/${locale}/transactions`}
          className={`${styles.navItem} ${isActive('/transactions') ? styles.active : ''}`}
        >
          <ArrowRightLeft className={styles.icon} size={20} />
          <span>{t('transactions', { default: 'Transactions' })}</span>
        </Link>
        <Link
          href={`/${locale}/settings`}
          className={`${styles.navItem} ${isActive('/settings') ? styles.active : ''}`}
        >
          <Settings className={styles.icon} size={20} />
          <span>{t('settings', { default: 'Paramètres' })}</span>
        </Link>
      </nav>

      <div className={styles.bottom}>
        <div className={styles.userInfo}>
          {avatarUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={avatarUrl} alt="Avatar" className={styles.userAvatarImage} />
          ) : (
            <div className={styles.userAvatar}>
              {user?.email?.[0].toUpperCase() || 'U'}
            </div>
          )}
          <div className={styles.email} title={user?.email ?? ''}>
            {user?.email}
          </div>
        </div>

        <div className={styles.actions}>
          <LanguageSwitch currentLocale={locale} />
          <button onClick={() => signOut(locale)} className={styles.logoutBtn} title={t('logout')}>
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  )
}
