import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { AuthProvider } from '@/contexts/AuthContext'
import { Navbar } from '@/components/layout/Navbar'
import { Sidebar } from '@/components/layout/Sidebar'
import styles from './AppShell.module.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Echelon Finance',
    default: 'Echelon Finance'
  },
  description: 'Gestion budgétaire personnelle — précision dans chaque transaction'
}

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

/**
 * LocaleLayout — responsabilité unique : fournir les providers i18n et auth
 * pour toutes les pages sous [locale]. Combine désormais App Shell (Sidebar + Navbar).
 */
export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  
  // Valider la locale
  if (!routing.locales.includes(locale as 'fr' | 'en')) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <AuthProvider>
        <div className={styles.appShell}>
          <Sidebar locale={locale} />
          <div className={styles.mainWrapper}>
            <Navbar locale={locale} />
            <main className={styles.mainContent}>{children}</main>
          </div>
        </div>
      </AuthProvider>
    </NextIntlClientProvider>
  )
}

