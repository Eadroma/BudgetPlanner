'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { useTransactions } from '@/hooks/useTransactions'
import { GroupedTransactionList } from './GroupedTransactionList'
import { TransactionForm } from '../dashboard/TransactionForm'
import styles from './TransactionsClient.module.css'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import type { Transaction, NewTransaction } from '@/types/transaction'

export function TransactionsClient() {
  const t = useTranslations('Dashboard')
  const { 
    transactions, 
    loading, 
    addTransaction,
    editTransaction,
    removeTransaction
  } = useTransactions()

  const [editingTx, setEditingTx] = React.useState<Transaction | null>(null)
  const [deletingTx, setDeletingTx] = React.useState<Transaction | null>(null)

  const handleRemove = async () => {
    if (!deletingTx) return
    try {
      await removeTransaction(deletingTx.id)
      setDeletingTx(null)
    } catch (err) {
      console.error('Failed to remove:', err)
    }
  }

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
          <GroupedTransactionList 
            transactions={transactions} 
            loading={loading} 
            onEdit={setEditingTx}
            onDelete={setDeletingTx}
          />
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
            onSubmit={async (data: NewTransaction) => {
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
            <Button variant="primary" onClick={handleRemove} style={{ backgroundColor: '#c62828', borderColor: '#c62828' }}>
              Delete Permanently
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
