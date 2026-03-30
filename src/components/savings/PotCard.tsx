'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Pencil, Trash2, PiggyBank, Plane, Home, Car, GraduationCap, Heart, ShieldCheck, Laptop, Gift, Wallet } from 'lucide-react'
import type { SavingsPot } from '@/types/savings'
import styles from './PotCard.module.css'

const ICON_MAP: Record<string, React.FC<{ size?: number | string; color?: string }>> = {
  PiggyBank, Plane, Home, Car, GraduationCap, Heart, ShieldCheck, Laptop, Gift, Wallet,
}

interface PotCardProps {
  pot: SavingsPot
  isActive: boolean
  onClick: () => void
  onEdit: () => void
  onDelete: () => void
}

export function PotCard({ pot, isActive, onClick, onEdit, onDelete }: PotCardProps) {
  const t = useTranslations('SavingsPage')
  const Icon = ICON_MAP[pot.icon] || PiggyBank
  const progress = pot.target_amount && pot.target_amount > 0
    ? Math.min(100, ((pot.current_amount ?? 0) / pot.target_amount) * 100)
    : null

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)

  return (
    <div
      className={`${styles.card} ${isActive ? styles.active : ''}`}
      onClick={onClick}
    >
      <div className={styles.header}>
        <div className={styles.iconWrap} style={{ backgroundColor: pot.color + '22', borderColor: pot.color + '44' }}>
          <Icon size={20} color={pot.color} />
        </div>
        <div className={styles.actions}>
          <button
            className={styles.actionBtn}
            onClick={(e) => { e.stopPropagation(); onEdit() }}
            title={t('edit')}
          >
            <Pencil size={14} />
          </button>
          <button
            className={`${styles.actionBtn} ${styles.deleteBtn}`}
            onClick={(e) => { e.stopPropagation(); onDelete() }}
            title={t('delete')}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className={styles.name}>{pot.name}</div>

      <div className={styles.balance}>
        {formatAmount(pot.current_amount ?? 0)}
      </div>

      {pot.target_amount !== null && (
        <div className={styles.targetRow}>
          <span className={styles.targetLabel}>
            {t('of')} {formatAmount(pot.target_amount)}
          </span>
          <span className={styles.percentage}>{Math.round(progress ?? 0)}%</span>
        </div>
      )}

      {progress !== null && (
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%`, backgroundColor: pot.color }}
          />
        </div>
      )}

      <div className={styles.entriesCount}>
        {t('entriesCount', { count: pot.entry_count ?? 0 })}
      </div>
    </div>
  )
}
