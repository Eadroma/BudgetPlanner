'use client'

import React, { useState } from 'react'
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
  const { pots, loading, error, summary, addPot, editPot, removePot } = useSavings()
  const [activePotId, setActivePotId] = useState<string | null>(null)

  // Pot modals
  const [isCreatePotOpen, setIsCreatePotOpen] = useState(false)
  const [editingPot, setEditingPot] = useState<SavingsPot | null>(null)
  const [deletingPot, setDeletingPot] = useState<SavingsPot | null>(null)

  // Entry modals
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
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Coffres d'Épargne</h1>
          <p className={styles.subtitle}>Constituez vos réserves financières, un coffre à la fois.</p>
        </div>
        <button className={styles.newPotBtn} onClick={() => setIsCreatePotOpen(true)}>
          <Plus size={18} />
          Nouveau coffre
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {/* Summary bar */}
      {pots.length > 0 && (
        <div className={styles.summaryBar}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>TOTAL ÉPARGNÉ</span>
            <span className={styles.summaryValue}>{formatAmount(summary.totalSaved)}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>COFFRES</span>
            <span className={styles.summaryValue}>{summary.potCount}</span>
          </div>
        </div>
      )}

      {/* Pots grid */}
      {loading ? (
        <div className={styles.loadingState}>Chargement...</div>
      ) : pots.length === 0 ? (
        <div className={styles.emptyState}>
          <PiggyBank size={48} className={styles.emptyIcon} />
          <p className={styles.emptyText}>Aucun coffre d'épargne pour l'instant.</p>
          <button className={styles.newPotBtn} onClick={() => setIsCreatePotOpen(true)}>
            <Plus size={18} />
            Créer mon premier coffre
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

      {/* Detail panel when a pot is selected */}
      {activePot && (
        <div className={styles.detailPanel}>
          <div className={styles.detailHeader}>
            <h2 className={styles.detailTitle}>{activePot.name}</h2>
            <span className={styles.detailBalance}>{formatAmount(activePot.current_amount ?? 0)}</span>
          </div>

          <div className={styles.detailContent}>
            <div className={styles.detailMain}>
              <h3 className={styles.sectionTitle}>Entrées</h3>
              <EntryList
                entries={entries}
                loading={entriesLoading}
                onEdit={setEditingEntry}
                onDelete={setDeletingEntry}
              />
            </div>

            <div className={styles.detailSidebar}>
              <EntryForm
                potId={activePot.id}
                onSubmit={handleAddEntry}
              />
            </div>
          </div>
        </div>
      )}

      {/* Create Pot Modal */}
      <Modal isOpen={isCreatePotOpen} onClose={() => setIsCreatePotOpen(false)} title="Nouveau Coffre">
        <PotForm onSubmit={handleCreatePot} onCancel={() => setIsCreatePotOpen(false)} />
      </Modal>

      {/* Edit Pot Modal */}
      <Modal isOpen={!!editingPot} onClose={() => setEditingPot(null)} title="Modifier le Coffre">
        {editingPot && (
          <PotForm initialData={editingPot} onSubmit={handleEditPot} onCancel={() => setEditingPot(null)} />
        )}
      </Modal>

      {/* Delete Pot Modal */}
      <Modal isOpen={!!deletingPot} onClose={() => setDeletingPot(null)} title="Supprimer le coffre">
        <div className={styles.confirmContent}>
          <p>Êtes-vous sûr de vouloir supprimer <strong>{deletingPot?.name}</strong> ? Toutes les entrées seront supprimées définitivement.</p>
          <div className={styles.confirmActions}>
            <Button variant="ghost" onClick={() => setDeletingPot(null)}>Annuler</Button>
            <Button variant="primary" onClick={handleDeletePot} style={{ backgroundColor: '#c62828', borderColor: '#c62828' }}>
              Supprimer définitivement
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Entry Modal */}
      <Modal isOpen={!!editingEntry} onClose={() => setEditingEntry(null)} title="Modifier l'entrée">
        {editingEntry && activePot && (
          <EntryForm
            potId={activePot.id}
            initialData={editingEntry}
            onSubmit={handleEditEntry}
            onCancel={() => setEditingEntry(null)}
          />
        )}
      </Modal>

      {/* Delete Entry Modal */}
      <Modal isOpen={!!deletingEntry} onClose={() => setDeletingEntry(null)} title="Supprimer l'entrée">
        <div className={styles.confirmContent}>
          <p>Supprimer cette entrée ? Cette action est irréversible.</p>
          <div className={styles.confirmActions}>
            <Button variant="ghost" onClick={() => setDeletingEntry(null)}>Annuler</Button>
            <Button variant="primary" onClick={handleDeleteEntry} style={{ backgroundColor: '#c62828', borderColor: '#c62828' }}>
              Supprimer l'entrée
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
