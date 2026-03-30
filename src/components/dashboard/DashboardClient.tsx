'use client'

import React from 'react'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { TransactionList } from '@/components/dashboard/TransactionList'
import { TransactionForm } from '@/components/dashboard/TransactionForm'
import { StatsChart } from '@/components/dashboard/StatsChart'
import { CashflowTrajectory } from '@/components/dashboard/CashflowTrajectory'
import { ExpenseDistribution } from '@/components/dashboard/ExpenseDistribution'
import { useTransactions } from '@/hooks/useTransactions'
import styles from '@/app/[locale]/dashboard/Dashboard.module.css'

export const DashboardClient: React.FC = () => {
  const { transactions, loading, error, addTransaction } = useTransactions()

  return (
    <div className={styles.grid}>
      <div className={styles.main}>
        {error && <div className={styles.error}>{error}</div>}
        
        <SummaryCards transactions={transactions} />
        
        <div className={styles.chartsRow}>
          <div className={styles.chartMain}>
            <CashflowTrajectory transactions={transactions} />
          </div>
          <div className={styles.chartSide}>
            <ExpenseDistribution transactions={transactions} />
          </div>
        </div>

        <TransactionList transactions={transactions} loading={loading} limit={3} showViewAll={true} />
      </div>
      <div className={styles.sidebar}>
        <div className={styles.sidebarSticky}>
          <StatsChart transactions={transactions} />
          <div style={{ marginTop: '2rem' }}>
            <TransactionForm onSubmit={addTransaction} />
          </div>
        </div>
      </div>
    </div>
  )
}
