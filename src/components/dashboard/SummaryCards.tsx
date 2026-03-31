import React from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { TrendingUp, TrendingDown } from 'lucide-react'
import type { Transaction } from '@/types/transaction'
import styles from './SummaryCards.module.css'

interface SummaryCardsProps {
  transactions: Transaction[]
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ transactions }) => {
  const t = useTranslations('Dashboard')
  const locale = useLocale()

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
    return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(val)
  }

  const savingsRate = income > 0 ? ((income - expense) / income) * 100 : null

  const statusKey = savingsRate === null
    ? 'heroStatusNoData'
    : savingsRate > 50
      ? 'heroStatusExcellent'
      : savingsRate > 20
        ? 'heroStatusGood'
        : savingsRate >= 0
          ? 'heroStatusFair'
          : 'heroStatusCritical'

  const progressWidth = savingsRate === null
    ? 0
    : savingsRate < 0
      ? 100
      : Math.min(100, savingsRate)

  const progressColor = statusKey === 'heroStatusExcellent'
    ? 'rgba(134, 239, 172, 0.9)'   // green
    : statusKey === 'heroStatusGood'
      ? 'var(--color-secondary-container)'
      : statusKey === 'heroStatusFair'
        ? 'rgba(251, 191, 36, 0.9)'  // amber
        : statusKey === 'heroStatusCritical'
          ? 'rgba(239, 68, 68, 0.9)'   // red
          : 'rgba(255, 255, 255, 0.2)'

  return (
    <div className={styles.container}>
      {/* Hero Card */}
      <div className={`${styles.card} ${styles.heroCard}`}>
        <div className={styles.heroHeader}>{t('heroNetBalance')}</div>
        <div className={styles.heroValue}>{formatCurrency(balance)}</div>
        <div className={styles.heroFooter}>
          <div className={styles.heroStatus}>
            <span className={styles.statusLabel}>{t(statusKey)}</span>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progressWidth}%`, backgroundColor: progressColor }}></div>
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
