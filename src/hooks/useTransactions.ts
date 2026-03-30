import { useState, useCallback, useEffect } from 'react'
import type { Transaction, NewTransaction } from '@/types/transaction'
import { fetchTransactions, createTransaction as createTx, updateTransaction as updateTx, deleteTransaction as deleteTx } from '@/services/transaction.service'

/**
 * Custom hook pour gérer l'état et la logique UI des transactions.
 */
export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true)
      const data = await fetchTransactions()
      setTransactions(data)
      setError(null)
    } catch (err: any) {
      console.error('Error fetching transactions:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTransactions()
  }, [loadTransactions])

  const addTransaction = async (tx: NewTransaction) => {
    try {
      setError(null)
      await createTx(tx)
      await loadTransactions() 
    } catch (err: any) {
      console.error('Error creating transaction:', err)
      setError(err.message)
      throw err 
    }
  }

  const editTransaction = async (id: string, updates: Partial<NewTransaction>) => {
    try {
      setError(null)
      await updateTx(id, updates)
      await loadTransactions()
    } catch (err: any) {
      console.error('Error updating transaction:', err)
      setError(err.message)
      throw err
    }
  }

  const removeTransaction = async (id: string) => {
    try {
      setError(null)
      await deleteTx(id)
      await loadTransactions()
    } catch (err: any) {
      console.error('Error deleting transaction:', err)
      setError(err.message)
      throw err
    }
  }

  return { 
    transactions, 
    loading, 
    error, 
    addTransaction, 
    editTransaction,
    removeTransaction,
    refresh: loadTransactions 
  }
}
