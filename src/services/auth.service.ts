import { createClient } from '@/lib/supabase/client'
import type { LoginCredentials, RegisterData, AuthError } from '@/types/auth'

/**
 * Service d'authentification — fonctions pures sans logique UI.
 * Toutes les fonctions retournent { data, error } pour une gestion
 * cohérente des erreurs dans les hooks/composants.
 */

export async function signInWithEmail(credentials: LoginCredentials) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password
  })
  return { data, error: mapError(error) }
}

export async function signUpWithEmail(registerData: RegisterData) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signUp({
    email: registerData.email,
    password: registerData.password,
    options: {
      emailRedirectTo: `${window.location.origin}${window.location.pathname.startsWith('/fr') ? '/fr' : '/en'}/auth/callback`
    }
  })
  return { data, error: mapError(error) }
}

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  return { error: mapError(error) }
}

export async function resetPassword(email: string, locale: string) {
  const supabase = createClient()
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/${locale}/auth/callback?next=/${locale}/reset-password`,
  })
  return { error: mapError(error) }
}

export async function updatePassword(password: string) {
  const supabase = createClient()
  const { error } = await supabase.auth.updateUser({ password })
  return { error: mapError(error) }
}

// Mapper les erreurs Supabase vers notre type AuthError
function mapError(error: unknown): AuthError | null {
  if (!error) return null
  const e = error as { message?: string; code?: string }
  return {
    message: e.message ?? 'Une erreur est survenue.',
    code: e.code
  }
}
