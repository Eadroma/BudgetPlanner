import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SavingsClient } from '@/components/savings/SavingsClient'
import styles from './Savings.module.css'

export const metadata: Metadata = {
  title: 'Épargne'
}

interface SavingsPageProps {
  params: Promise<{ locale: string }>
}

export default async function SavingsPage({ params }: SavingsPageProps) {
  const { locale } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${locale}/login`)
  }

  return (
    <div className={styles.container}>
      <SavingsClient />
    </div>
  )
}
