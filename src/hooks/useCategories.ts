import { useState, useCallback, useEffect } from 'react'
import type { Category, TransactionType } from '@/types/transaction'
import { 
  fetchCategories, 
  createCategory as createCat, 
  updateCategory as updateCat, 
  deleteCategory as deleteCat 
} from '@/services/category.service'

/**
 * Custom hook pour gérer l'état et la logique UI des catégories.
 */
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true)
      const data = await fetchCategories()
      setCategories(data)
      setError(null)
    } catch (err: any) {
      console.error('Error fetching categories:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  const addCategory = async (category: { 
    name: string, 
    type: TransactionType, 
    icon?: string | null, 
    color?: string 
  }) => {
    try {
      setError(null)
      await createCat(category)
      await loadCategories() 
    } catch (err: any) {
      console.error('Error creating category:', err)
      setError(err.message)
      throw err 
    }
  }

  const editCategory = async (id: string, updates: Partial<{
    name: string,
    type: TransactionType,
    icon?: string | null,
    color?: string
  }>) => {
    try {
      setError(null)
      await updateCat(id, updates)
      await loadCategories()
    } catch (err: any) {
      console.error('Error updating category:', err)
      setError(err.message)
      throw err
    }
  }

  const removeCategory = async (id: string) => {
    try {
      setError(null)
      await deleteCat(id)
      await loadCategories()
    } catch (err: any) {
      console.error('Error deleting category:', err)
      setError(err.message)
      throw err
    }
  }

  return { 
    categories, 
    loading, 
    error, 
    addCategory, 
    editCategory,
    removeCategory,
    refresh: loadCategories 
  }
}
