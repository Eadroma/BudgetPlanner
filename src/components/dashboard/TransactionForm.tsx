import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import type { NewTransaction, TransactionType } from '@/types/transaction'
import { useMembers } from '@/hooks/useMembers'
import styles from './TransactionForm.module.css'

interface TransactionFormProps {
  onSubmit: (data: NewTransaction) => Promise<void>
}

/**
 * SRP: Composant responsable uniquement du formulaire de création de transaction.
 */
export const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit }) => {
  const t = useTranslations('TransactionForm')
  
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<TransactionType>('expense')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [description, setDescription] = useState('')
  const { members } = useMembers()
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)

  // Pre-select default member
  React.useEffect(() => {
    if (members.length > 0 && !selectedMemberId) {
      const defaultMember = members.find(m => m.is_default)
      if (defaultMember) {
        setSelectedMemberId(defaultMember.id)
      } else if (members.length > 0) {
        setSelectedMemberId(members[0].id)
      }
    }
  }, [members, selectedMemberId])
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !category || !date) return

    setIsSubmitting(true)
    setError(null)

    try {
      await onSubmit({
        amount: parseFloat(amount),
        type,
        category,
        date,
        description: description || undefined,
        member_id: selectedMemberId
      })
      // Reset
      setAmount('')
      setCategory('')
      setDescription('')
      setSelectedMemberId(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <h3 className={styles.title}>{t('title')}</h3>
        <p className={styles.subtitle}>{t('subtitle')}</p>
      </div>
      
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.typeSelector}>
        <button
          type="button"
          className={`${styles.typeButton} ${type === 'expense' ? styles.typeActive : styles.typeInactive}`}
          onClick={() => setType('expense')}
        >
          {t('expense')}
        </button>
        <button
          type="button"
          className={`${styles.typeButton} ${type === 'income' ? styles.typeActive : styles.typeInactive}`}
          onClick={() => setType('income')}
        >
          {t('income')}
        </button>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>{t('amount')}</label>
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
        <label className={styles.label}>{t('category')}</label>
        <select
          className={styles.select}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          disabled={isSubmitting}
        >
          <option value="" disabled>Select category...</option>
          <option value="Loyer - Appartement">Loyer (Rent)</option>
          <option value="Adobe Creative Cloud">Abonnement (Subscription)</option>
          <option value="Freelance Payout">Freelance</option>
          <option value="Le Petit Bistro">Loisirs (Dining)</option>
          <option value="Groceries">Alimentation (Groceries)</option>
        </select>
      </div>

      {members.length > 0 && (
        <div className={styles.field}>
          <label className={styles.label}>{t('member', { default: 'User' })}</label>
          <div className={styles.memberSelector}>
            {members.map((member) => (
              <button
                key={member.id}
                type="button"
                className={`${styles.memberPill} ${selectedMemberId === member.id ? styles.memberActive : ''}`}
                onClick={() => setSelectedMemberId(member.id)}
                style={{ 
                  borderColor: selectedMemberId === member.id ? member.color : 'rgba(255,255,255,0.2)',
                  backgroundColor: selectedMemberId === member.id ? 'white' : 'rgba(255,255,255,0.08)'
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
        <label className={styles.label}>{t('date')}</label>
        <input
          type="date"
          className={styles.input}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>{t('description')}</label>
        <textarea
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write a short detail..."
          disabled={isSubmitting}
        />
      </div>

      <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
        {isSubmitting ? '...' : t('submit')}
      </button>
    </form>
  )
}
