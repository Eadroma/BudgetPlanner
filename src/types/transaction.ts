export type TransactionType = 'income' | 'expense'

export interface Member {
  id: string
  name: string
  color: string
  is_default?: boolean
}

export interface Category {
  id: string
  user_id: string
  name: string
  icon?: string | null
  color?: string
  type: TransactionType
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  amount: number
  type: TransactionType
  category: string
  category_id?: string | null
  category_data?: Category | null
  date: string
  description: string | null
  member_id: string | null
  member?: Member | null
  created_at: string
}

export interface NewTransaction {
  amount: number
  type: TransactionType
  category: string
  category_id?: string | null
  date: string
  description?: string
  member_id?: string | null
}
