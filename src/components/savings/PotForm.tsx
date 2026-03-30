'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { PiggyBank, Plane, Home, Car, GraduationCap, Heart, ShieldCheck, Laptop, Gift, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { SavingsPot, NewSavingsPot } from '@/types/savings'
import styles from './PotForm.module.css'

const PRESET_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
]

const ICONS = [
  { id: 'PiggyBank', Icon: PiggyBank },
  { id: 'Plane', Icon: Plane },
  { id: 'Home', Icon: Home },
  { id: 'Car', Icon: Car },
  { id: 'GraduationCap', Icon: GraduationCap },
  { id: 'Heart', Icon: Heart },
  { id: 'ShieldCheck', Icon: ShieldCheck },
  { id: 'Laptop', Icon: Laptop },
  { id: 'Gift', Icon: Gift },
  { id: 'Wallet', Icon: Wallet },
]

interface PotFormProps {
  initialData?: SavingsPot
  onSubmit: (data: NewSavingsPot) => Promise<void>
  onCancel: () => void
}

export function PotForm({ initialData, onSubmit, onCancel }: PotFormProps) {
  const t = useTranslations('SavingsPage')
  const [name, setName] = useState(initialData?.name || '')
  const [targetAmount, setTargetAmount] = useState(initialData?.target_amount?.toString() || '')
  const [color, setColor] = useState(initialData?.color || '#3b82f6')
  const [icon, setIcon] = useState(initialData?.icon || 'PiggyBank')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setIsSubmitting(true)
    setError(null)
    try {
      await onSubmit({
        name: name.trim(),
        target_amount: targetAmount ? parseFloat(targetAmount) : null,
        color,
        icon,
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.field}>
        <label className={styles.label}>{t('potNameLabel')}</label>
        <input
          type="text"
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('potNamePlaceholder')}
          required
          autoFocus
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>{t('targetAmountLabel')}</label>
        <div className={styles.amountWrapper}>
          <span className={styles.amountSymbol}>€</span>
          <input
            type="number"
            className={styles.amountInput}
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            step="0.01"
            min="0"
            placeholder={t('targetAmountPlaceholder')}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>{t('colorLabel')}</label>
        <div className={styles.colorPicker}>
          {PRESET_COLORS.map(c => (
            <button
              key={c}
              type="button"
              className={`${styles.colorSwatch} ${color === c ? styles.colorActive : ''}`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>{t('iconLabel')}</label>
        <div className={styles.iconPicker}>
          {ICONS.map(({ id, Icon }) => (
            <button
              key={id}
              type="button"
              className={`${styles.iconBtn} ${icon === id ? styles.iconActive : ''}`}
              onClick={() => setIcon(id)}
              style={icon === id ? { borderColor: color, color } : {}}
            >
              <Icon size={18} />
            </button>
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <Button variant="ghost" type="button" onClick={onCancel} disabled={isSubmitting}>
          {t('cancel')}
        </Button>
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? '...' : initialData ? t('updateVaultBtn') : t('createVaultBtn')}
        </Button>
      </div>
    </form>
  )
}
