export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  user_id: string
  amount: number
  type: TransactionType
  category: string
  date: string
  description: string | null
  created_at: string
}

export interface NewTransaction {
  amount: number
  type: TransactionType
  category: string
  date: string
  description?: string
}
