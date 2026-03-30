import { createClient } from '@/lib/supabase/client'
import type { Transaction, NewTransaction } from '@/types/transaction'

/**
 * Service pur pour interagir avec la table transactions via Supabase.
 * Respecte le SRP : uniquement la logique d'accès aux données.
 */

export const fetchTransactions = async (): Promise<Transaction[]> => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export const createTransaction = async (transaction: NewTransaction): Promise<Transaction> => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non authentifié")

  const { data, error } = await supabase
    .from('transactions')
    .insert([{ ...transaction, user_id: user.id }])
    .select()
    .single()

  if (error) throw error
  return data
}
