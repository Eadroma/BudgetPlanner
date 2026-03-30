'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Plus, PiggyBank } from 'lucide-react'
import { useSavings, useSavingsEntries } from '@/hooks/useSavings'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { PotGrid } from './PotGrid'
import { PotForm } from './PotForm'
import { EntryList } from './EntryList'
import { EntryForm } from './EntryForm'
import type { SavingsPot, SavingsEntry, NewSavingsPot, NewSavingsEntry } from '@/types/savings'
import styles from './SavingsClient.module.css'

export function SavingsClient() {
  const t = useTranslations('SavingsPage')
  const { pots, loading, error, summary, addPot, editPot, removePot } = useSavings()
  const [activePotId, setActivePotId] = useState<string | null>(null)

  const [isCreatePotOpen, setIsCreatePotOpen] = useState(false)
  const [editingPot, setEditingPot] = useState<SavingsPot | null>(null)
  const [deletingPot, setDeletingPot] = useState<SavingsPot | null>(null)
  const [editingEntry, setEditingEntry] = useState<SavingsEntry | null>(null)
  const [deletingEntry, setDeletingEntry] = useState<SavingsEntry | null>(null)

  const activePot = pots.find(p => p.id === activePotId) ?? null
  const { entries, loading: entriesLoading, addEntry, editEntry, removeEntry } = useSavingsEntries(activePotId || '')

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)

  const handleCreatePot = async (data: NewSavingsPot) => {
    await addPot(data)
    setIsCreatePotOpen(false)
  }

  const handleEditPot = async (data: NewSavingsPot) => {
    if (!editingPot) return
    await editPot(editingPot.id, data)
    setEditingPot(null)
  }

  const handleDeletePot = async () => {
    if (!deletingPot) return
    await removePot(deletingPot.id)
    if (activePotId === deletingPot.id) setActivePotId(null)
    setDeletingPot(null)
  }

  const handleAddEntry = async (data: NewSavingsEntry) => {
    await addEntry(data)
  }

  const handleEditEntry = async (data: NewSavingsEntry) => {
    if (!editingEntry) return
    await editEntry(editingEntry.id, data)
    setEditingEntry(null)
  }

  const handleDeleteEntry = async () => {
    if (!deletingEntry) return
    await removeEntry(deletingEntry.id)
    setDeletingEntry(null)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>{t('title')}</h1>
          <p className={styles.subtitle}>{t('subtitle')}</p>
        </div>
        <button className={styles.newPotBtn} onClick={() => setIsCreatePotOpen(true)}>
          <Plus size={18} />
          {t('newVaultBtn')}
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {pots.length > 0 && (
        <div className={styles.summaryBar}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>{t('totalSaved')}</span>
            <span className={styles.summaryValue}>{formatAmount(summary.totalSaved)}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>{t('vaultsCount')}</span>
            <span className={styles.summaryValue}>{summary.potCount}</span>
          </div>
        </div>
      )}

      {loading ? (
        <div className={styles.loadingState}>{t('loading')}</div>
      ) : pots.length === 0 ? (
        <div className={styles.emptyState}>
          <PiggyBank size={48} className={styles.emptyIcon} />
          <p className={styles.emptyText}>{t('noVaults')}</p>
          <button className={styles.newPotBtn} onClick={() => setIsCreatePotOpen(true)}>
            <Plus size={18} />
            {t('createFirst')}
          </button>
        </div>
      ) : (
        <PotGrid
          pots={pots}
          activePotId={activePotId}
          onSelect={setActivePotId}
          onEdit={setEditingPot}
          onDelete={setDeletingPot}
        />
      )}

      {activePot && (
        <div className={styles.detailPanel}>
          <div className={styles.detailHeader}>
            <h2 className={styles.detailTitle}>{activePot.name}</h2>
            <span className={styles.detailBalance}>{formatAmount(activePot.current_amount ?? 0)}</span>
          </div>
          <div className={styles.detailContent}>
            <div className={styles.detailMain}>
              <h3 className={styles.sectionTitle}>{t('entries')}</h3>
              <EntryList
                entries={entries}
                loading={entriesLoading}
                onEdit={setEditingEntry}
                onDelete={setDeletingEntry}
              />
            </div>
            <div className={styles.detailSidebar}>
              <EntryForm potId={activePot.id} onSubmit={handleAddEntry} />
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={isCreatePotOpen} onClose={() => setIsCreatePotOpen(false)} title={t('createVaultTitle')}>
        <PotForm onSubmit={handleCreatePot} onCancel={() => setIsCreatePotOpen(false)} />
      </Modal>

      <Modal isOpen={!!editingPot} onClose={() => setEditingPot(null)} title={t('editVaultTitle')}>
        {editingPot && (
          <PotForm initialData={editingPot} onSubmit={handleEditPot} onCancel={() => setEditingPot(null)} />
        )}
      </Modal>

      <Modal isOpen={!!deletingPot} onClose={() => setDeletingPot(null)} title={t('deleteVaultTitle')}>
        <div className={styles.confirmContent}>
          <p>{t.rich('deleteVaultMsg', { name: deletingPot?.name ?? '', b: (chunks) => <strong>{chunks}</strong> })}</p>
          <div className={styles.confirmActions}>
            <Button variant="ghost" onClick={() => setDeletingPot(null)}>{t('cancel')}</Button>
            <Button variant="primary" onClick={handleDeletePot} style={{ backgroundColor: '#c62828', borderColor: '#c62828' }}>
              {t('deleteVaultConfirm')}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!editingEntry} onClose={() => setEditingEntry(null)} title={t('editEntryTitle')}>
        {editingEntry && activePot && (
          <EntryForm
            potId={activePot.id}
            initialData={editingEntry}
            onSubmit={handleEditEntry}
            onCancel={() => setEditingEntry(null)}
          />
        )}
      </Modal>

      <Modal isOpen={!!deletingEntry} onClose={() => setDeletingEntry(null)} title={t('deleteEntryTitle')}>
        <div className={styles.confirmContent}>
          <p>{t('deleteEntryMsg')}</p>
          <div className={styles.confirmActions}>
            <Button variant="ghost" onClick={() => setDeletingEntry(null)}>{t('cancel')}</Button>
            <Button variant="primary" onClick={handleDeleteEntry} style={{ backgroundColor: '#c62828', borderColor: '#c62828' }}>
              {t('deleteEntryConfirm')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
