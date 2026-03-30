import type { Metadata } from 'next'
import { AuthCard } from '@/components/auth/AuthCard'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'

export const metadata: Metadata = {
  title: 'Forgot Password'
}

interface ForgotPasswordPageProps {
  params: Promise<{ locale: string }>
}

export default async function ForgotPasswordPage({ params }: ForgotPasswordPageProps) {
  const { locale } = await params
  return (
    <AuthCard
      sidebarTagline="Precision in every transaction. Mastery in every ledger."
      sidebarDescription="Recover access to your private ledger securely."
    >
      <ForgotPasswordForm locale={locale} />
    </AuthCard>
  )
}
