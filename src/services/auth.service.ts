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
    password: registerData.password
  })
  return { data, error: mapError(error) }
}

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  return { error: mapError(error) }
}

export async function resetPassword(email: string) {
  const supabase = createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`
  })
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
