import { createBrowserClient } from '@supabase/ssr'

/**
 * Supabase browser client — utilisé uniquement dans les Client Components.
 * Les clés sont publiques (anon key) : sûres à exposer côté client.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase project URL and Key are required! Check your Environment Variables.')
  }

  return createBrowserClient(
    supabaseUrl!,
    supabaseKey!
  )
}
