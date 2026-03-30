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
    .select('*, member:members(*)')
    .order('date', { ascending: false })

  if (error) throw error
  return data || []
}

export const createTransaction = async (transaction: NewTransaction): Promise<Transaction> => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non authentifié")

  const { data, error } = await supabase
    .from('transactions')
    .insert([{ 
      ...transaction, 
      user_id: user.id,
      member_id: transaction.member_id || null 
    }])
    .select('*, member:members(*)')
    .single()

  if (error) throw error
  return data
}
export const deleteTransaction = async (id: string): Promise<void> => {
  const supabase = createClient()
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export const updateTransaction = async (id: string, updates: Partial<NewTransaction>): Promise<Transaction> => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
    .select('*, member:members(*)')
    .single()

  if (error) throw error
  return data
}
