import { createBrowserClient } from '@supabase/ssr'

/**
 * Supabase browser client — utilisé uniquement dans les Client Components.
 * Les clés sont publiques (anon key) : sûres à exposer côté client.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
