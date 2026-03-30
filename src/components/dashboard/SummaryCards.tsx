import React from 'react'
import { useTranslations } from 'next-intl'
import { TrendingUp, TrendingDown } from 'lucide-react'
import type { Transaction } from '@/types/transaction'
import styles from './SummaryCards.module.css'

interface SummaryCardsProps {
  transactions: Transaction[]
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ transactions }) => {
  const t = useTranslations('Dashboard')

  const { income, expense, balance } = transactions.reduce(
    (acc, tx) => {
      const amount = Number(tx.amount)
      if (tx.type === 'income') {
        acc.income += amount
        acc.balance += amount
      } else {
        acc.expense += amount
        acc.balance -= amount
      }
      return acc
    },
    { income: 0, expense: 0, balance: 0 }
  )

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val)
  }

  return (
    <div className={styles.container}>
      {/* Hero Card */}
      <div className={`${styles.card} ${styles.heroCard}`}>
        <div className={styles.heroHeader}>{t('heroNetBalance')}</div>
        <div className={styles.heroValue}>{formatCurrency(balance)}</div>
        <div className={styles.heroFooter}>
          <div className={styles.heroStatus}>
            <span className={styles.statusLabel}>{t('heroStatus')}</span>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: '64%' }}></div>
            </div>
          </div>
          <div className={styles.heroMeta}>{t('heroUpdated')}</div>
        </div>
      </div>

      <div className={styles.sideCards}>
        {/* Income Card */}
        <div className={styles.statCard}>
          <div className={`${styles.iconWrap} ${styles.iconWrapIncome}`}>
            <TrendingUp size={20} className={styles.iconIncome} />
          </div>
          <div>
            <div className={styles.statLabel}>{t('monthlyIncome')}</div>
            <div className={`${styles.statValue} ${styles.positive}`}>{formatCurrency(income)}</div>
          </div>
        </div>

        {/* Expense Card */}
        <div className={styles.statCard}>
          <div className={`${styles.iconWrap} ${styles.iconWrapExpense}`}>
            <TrendingDown size={20} className={styles.iconExpense} />
          </div>
          <div>
            <div className={styles.statLabel}>{t('monthlyExpenses')}</div>
            <div className={`${styles.statValue} ${styles.negative}`}>{formatCurrency(expense)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
