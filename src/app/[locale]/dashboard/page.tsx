import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { DashboardClient } from '@/components/dashboard/DashboardClient'
import styles from './Dashboard.module.css'

export const metadata: Metadata = {
  title: 'Tableau de bord'
}

interface DashboardPageProps {
  params: Promise<{ locale: string }>
}

/**
 * DashboardPage — page protégée.
 * Vérifie la session côté serveur (double sécurité en plus du middleware).
 */
export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${locale}/login`)
  }

  const t = await getTranslations('Dashboard')

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('title')}</h1>
          <p className={styles.subtitle}>{t('summary')}</p>
        </div>
      </header>
      
      <DashboardClient />
    </div>
  )
}
