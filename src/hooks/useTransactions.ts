import { useState, useCallback, useEffect } from 'react'
import type { Transaction, NewTransaction } from '@/types/transaction'
import { fetchTransactions, createTransaction as createTx } from '@/services/transaction.service'

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
      await loadTransactions() // Refresh après insertion
    } catch (err: any) {
      console.error('Error creating transaction:', err)
      setError(err.message)
      throw err // Pour permettre au formulaire de catch
    }
  }

  return { transactions, loading, error, addTransaction, refresh: loadTransactions }
}
