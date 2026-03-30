import type { Metadata } from 'next'
import { AuthCard } from '@/components/auth/AuthCard'
import { RegisterForm } from '@/components/auth/RegisterForm'

export const metadata: Metadata = {
  title: 'Inscription'
}

interface RegisterPageProps {
  params: Promise<{ locale: string }>
}

/**
 * RegisterPage — responsabilité unique : composer la page d'inscription.
 */
export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale } = await params;
  return (
    <AuthCard
      sidebarTagline="L'architecture de la richesse, redéfinie."
      sidebarDescription="Rejoignez 50 000+ partenaires institutionnels et privés."
    >
      <RegisterForm locale={locale} />
    </AuthCard>
  )
}
