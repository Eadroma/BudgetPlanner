'use client'

import { useState, useEffect, useCallback } from 'react'
import { Member, memberService } from '@/services/member.service'

export function useMembers() {
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchMembers = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await memberService.getMembers()
      setMembers(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch members'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  const addMember = async (name: string, color: string) => {
    try {
      const newMember = await memberService.addMember(name, color)
      setMembers(prev => [...prev, newMember].sort((a, b) => a.name.localeCompare(b.name)))
      return newMember
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add member')
    }
  }

  const deleteMember = async (id: string) => {
    try {
      await memberService.deleteMember(id)
      setMembers(prev => prev.filter(m => m.id !== id))
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete member')
    }
  }

  const setDefaultMember = async (id: string) => {
    try {
      await memberService.setDefaultMember(id)
      await fetchMembers()
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to set default member')
    }
  }

  return {
    members,
    isLoading,
    error,
    refreshMembers: fetchMembers,
    addMember,
    deleteMember,
    setDefaultMember
  }
}
