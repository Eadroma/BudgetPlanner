'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import type { SavingsPot, SavingsEntry, NewSavingsPot, NewSavingsEntry, SavingsSummary } from '@/types/savings'
import {
  fetchPotsWithBalance,
  createPot,
  updatePot,
  deletePot,
  fetchEntriesByPot,
  createEntry,
  updateEntry,
  deleteEntry,
} from '@/services/savings.service'

export function useSavings() {
  const [pots, setPots] = useState<SavingsPot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadPots = useCallback(async () => {
    try {
      setLoading(true)
      const data = await fetchPotsWithBalance()
      setPots(data)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPots()
  }, [loadPots])

  const addPot = async (pot: NewSavingsPot) => {
    try {
      setError(null)
      await createPot(pot)
      await loadPots()
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const editPot = async (id: string, updates: Partial<NewSavingsPot>) => {
    try {
      setError(null)
      await updatePot(id, updates)
      await loadPots()
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const removePot = async (id: string) => {
    try {
      setError(null)
      await deletePot(id)
      await loadPots()
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const summary = useMemo<SavingsSummary>(() => ({
    totalSaved: pots.reduce((sum, p) => sum + (p.current_amount ?? 0), 0),
    potCount: pots.length,
    topPots: [...pots]
      .sort((a, b) => (b.current_amount ?? 0) - (a.current_amount ?? 0))
      .slice(0, 3),
  }), [pots])

  return { pots, loading, error, summary, addPot, editPot, removePot, refresh: loadPots }
}

export function useSavingsEntries(potId: string) {
  const [entries, setEntries] = useState<SavingsEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadEntries = useCallback(async () => {
    if (!potId) return
    try {
      setLoading(true)
      const data = await fetchEntriesByPot(potId)
      setEntries(data)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [potId])

  useEffect(() => {
    loadEntries()
  }, [loadEntries])

  const addEntry = async (entry: NewSavingsEntry) => {
    try {
      setError(null)
      await createEntry(entry)
      await loadEntries()
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const editEntry = async (id: string, updates: Partial<NewSavingsEntry>) => {
    try {
      setError(null)
      await updateEntry(id, updates)
      await loadEntries()
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const removeEntry = async (id: string) => {
    try {
      setError(null)
      await deleteEntry(id)
      await loadEntries()
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  return { entries, loading, error, addEntry, editEntry, removeEntry, refresh: loadEntries }
}
