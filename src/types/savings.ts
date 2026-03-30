import type { Member } from './transaction'

export type SavingsEntryType = 'deposit' | 'withdrawal'

// ---- Pots ----

export interface SavingsPot {
  id: string
  user_id: string
  name: string
  target_amount: number | null
  color: string
  icon: string
  created_at: string
  // Computed client-side in fetchPotsWithBalance
  current_amount?: number
  entry_count?: number
}

export interface NewSavingsPot {
  name: string
  target_amount?: number | null
  color: string
  icon: string
}

// ---- Entries ----

export interface SavingsEntry {
  id: string
  user_id: string
  pot_id: string
  amount: number
  type: SavingsEntryType
  date: string
  note: string | null
  member_id: string | null
  member?: Member | null
  created_at: string
}

export interface NewSavingsEntry {
  pot_id: string
  amount: number
  type: SavingsEntryType
  date: string
  note?: string
  member_id?: string | null
}

// ---- Dashboard summary ----

export interface SavingsSummary {
  totalSaved: number
  potCount: number
  topPots: SavingsPot[]
}
