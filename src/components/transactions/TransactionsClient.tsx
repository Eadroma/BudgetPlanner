'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { useTransactions } from '@/hooks/useTransactions'
import { GroupedTransactionList } from './GroupedTransactionList'
import { TransactionForm } from '../dashboard/TransactionForm'
import styles from './TransactionsClient.module.css'

export function TransactionsClient() {
  const t = useTranslations('Dashboard')
  const { transactions, loading, addTransaction } = useTransactions()

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t('monthlyOverview')}</h1>
      </header>
      
      <div className={styles.grid}>
        <div className={styles.leftColumn}>
          <TransactionForm onSubmit={addTransaction} />
        </div>
        
        <div className={styles.rightColumn}>
          <GroupedTransactionList transactions={transactions} loading={loading} />
        </div>
      </div>
    </div>
  )
}
