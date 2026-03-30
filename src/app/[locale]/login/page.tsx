import type { Metadata } from 'next'
import { AuthCard } from '@/components/auth/AuthCard'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Connexion'
}

interface LoginPageProps {
  params: Promise<{ locale: string }>
}

/**
 * LoginPage — responsabilité unique : composer la page de connexion.
 * Aucune logique ici, uniquement de la composition.
 */
export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;
  return (
    <AuthCard
      sidebarTagline="Précision dans chaque transaction. Maîtrise dans chaque grand livre."
      sidebarDescription="Une approche architecturale de la gestion patrimoniale. Bâtie sur la stabilité, conçue pour la clarté."
    >
      <LoginForm locale={locale} />
    </AuthCard>
  )
}
