'use client'

import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/contexts/AuthContext'
import * as authService from '@/services/auth.service'
import type { LoginCredentials, RegisterData } from '@/types/auth'

/**
 * useAuth — responsabilité unique : exposer les actions d'authentification
 * en combinant le contexte et le service. Gère la navigation post-auth.
 */
export function useAuth() {
  const { user, session, isLoading } = useAuthContext()
  const router = useRouter()

  async function signIn(credentials: LoginCredentials, locale: string) {
    const { data, error } = await authService.signInWithEmail(credentials)
    if (!error && data.session) {
      router.push(`/${locale}/dashboard`)
      router.refresh()
    }
    return { error }
  }

  async function signUp(data: RegisterData, locale: string) {
    const { data: result, error } = await authService.signUpWithEmail(data)
    if (!error && result.user) {
      // Si la confirmation email est désactivée dans Supabase, on redirige
      // Sinon, on reste sur la page d'inscription avec un message de succès
      if (result.session) {
        router.push(`/${locale}/dashboard`)
        router.refresh()
      }
    }
    return { error, needsEmailConfirmation: !result?.session && !error }
  }

  async function signOut(locale: string) {
    const { error } = await authService.signOut()
    if (!error) {
      router.push(`/${locale}/login`)
      router.refresh()
    }
    return { error }
  }

  return {
    user,
    session,
    isLoading,
    isAuthenticated: !!session,
    signIn,
    signUp,
    signOut
  }
}
