import { createClient } from '@/lib/supabase/client'
import type { SavingsPot, NewSavingsPot, SavingsEntry, NewSavingsEntry } from '@/types/savings'

// ---- Pots ----

export const fetchPots = async (): Promise<SavingsPot[]> => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('savings_pots')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export const fetchPotsWithBalance = async (): Promise<SavingsPot[]> => {
  const supabase = createClient()

  const { data: pots, error: potsError } = await supabase
    .from('savings_pots')
    .select('*')
    .order('created_at', { ascending: false })

  if (potsError) throw potsError
  if (!pots || pots.length === 0) return []

  const { data: entries, error: entriesError } = await supabase
    .from('savings_entries')
    .select('pot_id, amount, type')

  if (entriesError) throw entriesError

  const balanceMap = new Map<string, { amount: number; count: number }>()
  for (const entry of entries || []) {
    const prev = balanceMap.get(entry.pot_id) ?? { amount: 0, count: 0 }
    const delta = entry.type === 'deposit' ? entry.amount : -entry.amount
    balanceMap.set(entry.pot_id, { amount: prev.amount + delta, count: prev.count + 1 })
  }

  return pots.map(pot => ({
    ...pot,
    current_amount: Math.max(0, balanceMap.get(pot.id)?.amount ?? 0),
    entry_count: balanceMap.get(pot.id)?.count ?? 0,
  }))
}

export const createPot = async (pot: NewSavingsPot): Promise<SavingsPot> => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  const { data, error } = await supabase
    .from('savings_pots')
    .insert([{ ...pot, user_id: user.id }])
    .select('*')
    .single()

  if (error) throw error
  return data
}

export const updatePot = async (id: string, updates: Partial<NewSavingsPot>): Promise<SavingsPot> => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('savings_pots')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  return data
}

export const deletePot = async (id: string): Promise<void> => {
  const supabase = createClient()
  const { error } = await supabase
    .from('savings_pots')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ---- Entries ----

export const fetchEntriesByPot = async (potId: string): Promise<SavingsEntry[]> => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('savings_entries')
    .select('*, member:members(*)')
    .eq('pot_id', potId)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export const createEntry = async (entry: NewSavingsEntry): Promise<SavingsEntry> => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  const { data, error } = await supabase
    .from('savings_entries')
    .insert([{
      ...entry,
      user_id: user.id,
      member_id: entry.member_id || null,
      note: entry.note || null,
    }])
    .select('*, member:members(*)')
    .single()

  if (error) throw error
  return data
}

export const updateEntry = async (id: string, updates: Partial<NewSavingsEntry>): Promise<SavingsEntry> => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('savings_entries')
    .update(updates)
    .eq('id', id)
    .select('*, member:members(*)')
    .single()

  if (error) throw error
  return data
}

export const deleteEntry = async (id: string): Promise<void> => {
  const supabase = createClient()
  const { error } = await supabase
    .from('savings_entries')
    .delete()
    .eq('id', id)

  if (error) throw error
}
