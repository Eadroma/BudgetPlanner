'use client'

import React from 'react'
import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { TransactionList } from '@/components/dashboard/TransactionList'
import { TransactionForm } from '@/components/dashboard/TransactionForm'
import { StatsChart } from '@/components/dashboard/StatsChart'
import { CashflowTrajectory } from '@/components/dashboard/CashflowTrajectory'
import { ExpenseDistribution } from '@/components/dashboard/ExpenseDistribution'
import { SavingsWidget } from '@/components/savings/SavingsWidget'
import { useTransactions } from '@/hooks/useTransactions'
import { useMembers } from '@/hooks/useMembers'
import styles from '@/app/[locale]/dashboard/Dashboard.module.css'

import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import type { Transaction } from '@/types/transaction'

export const DashboardClient: React.FC = () => {
  const { 
    transactions, 
    loading, 
    error, 
    addTransaction, 
    editTransaction, 
    removeTransaction 
  } = useTransactions()
  const { members } = useMembers()
  const [activeMemberTab, setActiveMemberTab] = React.useState<string>('all')

  // States for Modals
  const [editingTx, setEditingTx] = React.useState<Transaction | null>(null)
  const [deletingTx, setDeletingTx] = React.useState<Transaction | null>(null)

  const filteredTransactions = React.useMemo(() => {
    if (activeMemberTab === 'all') return transactions
    return transactions.filter(tx => tx.member_id === activeMemberTab)
  }, [transactions, activeMemberTab])

  const handleDelete = async () => {
    if (!deletingTx) return
    try {
      await removeTransaction(deletingTx.id)
      setDeletingTx(null)
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  return (
    <>
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
            onEdit={setEditingTx}
            onDelete={setDeletingTx}
          />
        </div>

        <div className={styles.sidebar}>
          <div className={styles.sidebarSticky}>
            <SavingsWidget />
            <StatsChart transactions={transactions} />
            <div id="add" style={{ marginTop: '2rem', scrollMarginTop: '2rem' }}>
              <TransactionForm onSubmit={addTransaction} />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal 
        isOpen={!!editingTx} 
        onClose={() => setEditingTx(null)} 
        title="Edit Transaction"
      >
        {editingTx && (
          <TransactionForm 
            initialData={editingTx}
            title="Update Details"
            subtitle="Modify values below"
            onSubmit={async (data) => {
              await editTransaction(editingTx.id, data)
              setEditingTx(null)
            }}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingTx}
        onClose={() => setDeletingTx(null)}
        title="Delete Transaction"
      >
        <div className={styles.confirmContent}>
          <p>Are you sure you want to delete this transaction? This action is irreversible.</p>
          <div className={styles.modalActions}>
            <Button variant="ghost" onClick={() => setDeletingTx(null)}>Cancel</Button>
            <Button variant="primary" onClick={handleDelete} style={{ backgroundColor: '#c62828', borderColor: '#c62828' }}>
              Delete Permanently
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
