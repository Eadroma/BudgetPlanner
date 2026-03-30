'use client'

import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { useMembers } from '@/hooks/useMembers'
import type { SavingsEntry, NewSavingsEntry, SavingsEntryType } from '@/types/savings'
import styles from './EntryForm.module.css'

interface EntryFormProps {
  potId: string
  initialData?: SavingsEntry
  onSubmit: (data: NewSavingsEntry) => Promise<void>
  onCancel?: () => void
}

export function EntryForm({ potId, initialData, onSubmit, onCancel }: EntryFormProps) {
  const t = useTranslations('SavingsPage')
  const [type, setType] = useState<SavingsEntryType>(initialData?.type || 'deposit')
  const [amount, setAmount] = useState(initialData?.amount.toString() || '')
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0])
  const [note, setNote] = useState(initialData?.note || '')
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(initialData?.member_id || null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { members } = useMembers()

  useEffect(() => {
    if (members.length > 0 && !selectedMemberId && !initialData) {
      const defaultMember = members.find(m => m.is_default)
      if (defaultMember) setSelectedMemberId(defaultMember.id)
      else setSelectedMemberId(members[0].id)
    }
  }, [members, selectedMemberId, initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount) return
    setIsSubmitting(true)
    setError(null)
    try {
      await onSubmit({
        pot_id: potId,
        amount: parseFloat(amount),
        type,
        date,
        note: note || undefined,
        member_id: selectedMemberId,
      })
      setAmount('')
      setNote('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.typeSelector}>
        <button
          type="button"
          className={`${styles.typeButton} ${type === 'deposit' ? styles.typeDeposit : styles.typeInactive}`}
          onClick={() => setType('deposit')}
        >
          {t('deposit')}
        </button>
        <button
          type="button"
          className={`${styles.typeButton} ${type === 'withdrawal' ? styles.typeWithdrawal : styles.typeInactive}`}
          onClick={() => setType('withdrawal')}
        >
          {t('withdrawal')}
        </button>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>{t('amountLabel')}</label>
        <div className={styles.amountWrapper}>
          <span className={styles.amountSymbol}>€</span>
          <input
            type="number"
            className={styles.amountInput}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            min="0"
            placeholder="0.00"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>{t('dateLabel')}</label>
        <input
          type="date"
          className={styles.input}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>

      {members.length > 0 && (
        <div className={styles.field}>
          <label className={styles.label}>{t('memberLabel')}</label>
          <div className={styles.memberSelector}>
            {members.map(member => (
              <button
                key={member.id}
                type="button"
                className={`${styles.memberPill} ${selectedMemberId === member.id ? styles.memberActive : ''}`}
                onClick={() => setSelectedMemberId(member.id)}
                style={{
                  borderColor: selectedMemberId === member.id ? member.color : 'rgba(255,255,255,0.2)',
                  backgroundColor: selectedMemberId === member.id ? 'white' : 'rgba(255,255,255,0.08)',
                  color: selectedMemberId === member.id ? 'var(--color-primary)' : 'white',
                }}
              >
                <span className={styles.colorDot} style={{ backgroundColor: member.color }} />
                {member.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.field}>
        <label className={styles.label}>{t('noteLabel')}</label>
        <input
          type="text"
          className={styles.input}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t('notePlaceholder')}
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.submitRow}>
        {onCancel && (
          <Button variant="ghost" type="button" onClick={onCancel} disabled={isSubmitting}>
            {t('cancel')}
          </Button>
        )}
        <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
          {isSubmitting ? '...' : t('confirmEntry')}
        </button>
      </div>
    </form>
  )
}
