import { createClient } from '@/lib/supabase/client'
import type { Category, TransactionType } from '@/types/transaction'

/**
 * Service pour interagir avec la table categories.
 */

export const fetchCategories = async (): Promise<Category[]> => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data || []
}

export const createCategory = async (category: { 
  name: string, 
  type: TransactionType, 
  icon?: string | null, 
  color?: string 
}): Promise<Category> => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non authentifié")

  const { data, error } = await supabase
    .from('categories')
    .insert([{ 
      ...category, 
      user_id: user.id 
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateCategory = async (id: string, updates: Partial<{
  name: string,
  type: TransactionType,
  icon?: string | null,
  color?: string
}>): Promise<Category> => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const deleteCategory = async (id: string): Promise<void> => {
  const supabase = createClient()
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) throw error
}
