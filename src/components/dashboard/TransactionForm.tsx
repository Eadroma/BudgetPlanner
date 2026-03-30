import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Plus } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import type { Transaction, NewTransaction, TransactionType } from '@/types/transaction'
import { useMembers } from '@/hooks/useMembers'
import styles from './TransactionForm.module.css'

interface TransactionFormProps {
  onSubmit: (data: NewTransaction) => Promise<void>
  initialData?: Transaction
  title?: string
  subtitle?: string
}

const DEFAULT_CATEGORIES = [
  "Loyer - Appartement",
  "Adobe Creative Cloud",
  "Freelance Payout",
  "Le Petit Bistro",
  "Groceries"
]

/**
 * SRP: Composant responsable uniquement du formulaire de création de transaction.
 */
export const TransactionForm: React.FC<TransactionFormProps> = ({ 
  onSubmit, 
  initialData,
  title,
  subtitle
}) => {
  const t = useTranslations('TransactionForm')
  
  const [amount, setAmount] = useState(initialData?.amount.toString() || '')
  const [type, setType] = useState<TransactionType>(initialData?.type || 'expense')
  const [category, setCategory] = useState(initialData?.category || '')
  const [customCategories, setCustomCategories] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0])
  const [description, setDescription] = useState(initialData?.description || '')
  const { members } = useMembers()
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(initialData?.member_id || null)

  const allCategories = [...DEFAULT_CATEGORIES, ...customCategories]

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

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return
    
    const trimmedBrand = newCategoryName.trim()
    if (!allCategories.includes(trimmedBrand)) {
      setCustomCategories(prev => [...prev, trimmedBrand])
    }
    setCategory(trimmedBrand)
    setNewCategoryName('')
    setIsModalOpen(false)
  }

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
      // Keep custom categories for next entry
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
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
          <div className={styles.selectWrapper}>
            <select
              className={styles.select}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              disabled={isSubmitting}
            >
              <option value="" disabled>{t('selectCategory')}</option>
              {allCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button
              type="button"
              className={styles.addCategoryBtn}
              onClick={() => setIsModalOpen(true)}
              title="Add Category"
            >
              <Plus size={18} />
            </button>
          </div>
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
            placeholder={t('descriptionPlaceholder')}
            disabled={isSubmitting}
          />
        </div>

        <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
          {isSubmitting ? '...' : t('submit')}
        </button>
      </form>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={t('newCategoryTitle')}
      >
        <form onSubmit={handleAddCategory} className={styles.modalForm}>
          <div className={styles.modalField}>
            <label className={styles.modalLabel}>{t('newCategoryLabel')}</label>
            <input
              autoFocus
              type="text"
              className={styles.modalInput}
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder={t('newCategoryPlaceholder')}
              required
            />
          </div>
          <div className={styles.modalActions}>
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              {t('cancel')}
            </Button>
            <Button variant="primary" type="submit">
              {t('createCategory')}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
