import type { Metadata } from 'next'
import { AuthCard } from '@/components/auth/AuthCard'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'

export const metadata: Metadata = {
  title: 'Reset Password'
}

interface ResetPasswordPageProps {
  params: Promise<{ locale: string }>
}

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { locale } = await params
  return (
    <AuthCard
      sidebarTagline="Precision in every transaction. Mastery in every ledger."
      sidebarDescription="Secure your private ledger with a new password."
    >
      <ResetPasswordForm locale={locale} />
    </AuthCard>
  )
}
