'use client'

import React from 'react'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { TransactionList } from '@/components/dashboard/TransactionList'
import { TransactionForm } from '@/components/dashboard/TransactionForm'
import { StatsChart } from '@/components/dashboard/StatsChart'
import { CashflowTrajectory } from '@/components/dashboard/CashflowTrajectory'
import { ExpenseDistribution } from '@/components/dashboard/ExpenseDistribution'
import { useTransactions } from '@/hooks/useTransactions'
import { useMembers } from '@/hooks/useMembers'
import styles from '@/app/[locale]/dashboard/Dashboard.module.css'

export const DashboardClient: React.FC = () => {
  const { transactions, loading, error, addTransaction } = useTransactions()
  const { members } = useMembers()
  const [activeMemberTab, setActiveMemberTab] = React.useState<string>('all')

  const filteredTransactions = React.useMemo(() => {
    if (activeMemberTab === 'all') return transactions
    return transactions.filter(tx => tx.member_id === activeMemberTab)
  }, [transactions, activeMemberTab])

  return (
    <div className={styles.grid}>
      <div className={styles.main}>
        {error && <div className={styles.error}>{error}</div>}
        
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeMemberTab === 'all' ? styles.tabActive : ''}`}
            onClick={() => setActiveMemberTab('all')}
          >
            <div className={styles.tabDot} />
            All Members
          </button>
          {members.map(member => (
            <button 
              key={member.id}
              className={`${styles.tab} ${activeMemberTab === member.id ? styles.tabActive : ''}`}
              onClick={() => setActiveMemberTab(member.id)}
            >
              <div className={styles.tabDot} style={{ backgroundColor: member.color }} />
              {member.name}
            </button>
          ))}
        </div>

        <SummaryCards transactions={filteredTransactions} />
        
        <div className={styles.chartsRow}>
          <div className={styles.chartMain}>
            <CashflowTrajectory transactions={filteredTransactions} />
          </div>
          <div className={styles.chartSide}>
            <ExpenseDistribution transactions={filteredTransactions} />
          </div>
        </div>

        <TransactionList 
          transactions={transactions} 
          loading={loading} 
          limit={5} 
          showViewAll={true} 
          memberFilter={activeMemberTab}
          onMemberFilterChange={setActiveMemberTab}
        />
      </div>

      <div className={styles.sidebar}>
        <div className={styles.sidebarSticky}>
          <StatsChart transactions={transactions} />
          <div id="add" style={{ marginTop: '2rem', scrollMarginTop: '2rem' }}>
            <TransactionForm onSubmit={addTransaction} />
          </div>
        </div>
      </div>
    </div>
  )
}
