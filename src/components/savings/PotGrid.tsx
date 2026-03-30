'use client'

import React from 'react'
import { PotCard } from './PotCard'
import type { SavingsPot } from '@/types/savings'
import styles from './PotGrid.module.css'

interface PotGridProps {
  pots: SavingsPot[]
  activePotId: string | null
  onSelect: (id: string) => void
  onEdit: (pot: SavingsPot) => void
  onDelete: (pot: SavingsPot) => void
}

export function PotGrid({ pots, activePotId, onSelect, onEdit, onDelete }: PotGridProps) {
  if (pots.length === 0) return null

  return (
    <div className={styles.grid}>
      {pots.map(pot => (
        <PotCard
          key={pot.id}
          pot={pot}
          isActive={activePotId === pot.id}
          onClick={() => onSelect(pot.id)}
          onEdit={() => onEdit(pot)}
          onDelete={() => onDelete(pot)}
        />
      ))}
    </div>
  )
}
