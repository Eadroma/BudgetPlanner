'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Pencil, Trash2, TrendingUp, TrendingDown } from 'lucide-react'
import type { SavingsEntry } from '@/types/savings'
import styles from './EntryList.module.css'

interface EntryListProps {
  entries: SavingsEntry[]
  loading: boolean
  onEdit: (entry: SavingsEntry) => void
  onDelete: (entry: SavingsEntry) => void
}

export function EntryList({ entries, loading, onEdit, onDelete }: EntryListProps) {
  const t = useTranslations('SavingsPage')

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })

  if (loading) {
    return <div className={styles.empty}>{t('loading')}</div>
  }

  if (entries.length === 0) {
    return <div className={styles.empty}>{t('noEntries')}</div>
  }

  return (
    <div className={styles.list}>
      {entries.map(entry => (
        <div key={entry.id} className={styles.row}>
          <div className={`${styles.icon} ${entry.type === 'deposit' ? styles.deposit : styles.withdrawal}`}>
            {entry.type === 'deposit'
              ? <TrendingUp size={16} />
              : <TrendingDown size={16} />
            }
          </div>

          <div className={styles.info}>
            <div className={styles.topRow}>
              <span className={`${styles.amount} ${entry.type === 'deposit' ? styles.amountDeposit : styles.amountWithdrawal}`}>
                {entry.type === 'deposit' ? '+' : '-'}{formatAmount(entry.amount)}
              </span>
              {entry.member && (
                <span className={styles.memberBadge}>
                  <span
                    className={styles.memberDot}
                    style={{ backgroundColor: entry.member.color }}
                  />
                  {entry.member.name}
                </span>
              )}
            </div>
            <div className={styles.bottomRow}>
              <span className={styles.date}>{formatDate(entry.date)}</span>
              {entry.note && <span className={styles.note}>{entry.note}</span>}
            </div>
          </div>

          <div className={styles.actions}>
            <button className={styles.actionBtn} onClick={() => onEdit(entry)} title={t('edit')}>
              <Pencil size={13} />
            </button>
            <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => onDelete(entry)} title={t('delete')}>
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
