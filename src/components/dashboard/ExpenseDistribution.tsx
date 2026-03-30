'use client'

import React, { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { PieChart, Pie, Cell } from 'recharts'
import type { Transaction } from '@/types/transaction'
import styles from './ExpenseDistribution.module.css'

interface ExpenseDistributionProps {
  transactions: Transaction[]
}

const COLORS = [
  'var(--color-primary)',      // Loyer (Navy)
  'var(--color-secondary-container)', // Dette (Mint Green)
  'var(--color-tertiary-container)', // Abonnement (Dark Red / Coral)
  'var(--color-primary-fixed-dim)',  // Other (Light Blue)
]

export function ExpenseDistribution({ transactions }: ExpenseDistributionProps) {
  const t = useTranslations('Dashboard')
  const [hoveredData, setHoveredData] = useState<{name: string, value: number, color: string} | null>(null)

  const chartData = useMemo(() => {
    // Agréger les dépenses par catégorie
    const expenses = transactions.filter(t => t.type === 'expense')
    const categoryTotals: Record<string, number> = {}
    let totalSpent = 0

    expenses.forEach(tx => {
      const amount = Number(tx.amount)
      const cat = tx.category || 'Autre'
      categoryTotals[cat] = (categoryTotals[cat] || 0) + amount
      totalSpent += amount
    })

    const data = Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    return { data, totalSpent }
  }, [transactions])

  const { data, totalSpent } = chartData

  if (totalSpent === 0) return null

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{t('expenseDistribution')}</h3>
          <p className={styles.subtitle}>{t('currentMonthAnalysis')}</p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.chartContainer}>
          <PieChart width={240} height={240}>
            <Pie
              data={data}
              cx={120}
              cy={120}
              innerRadius={70}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
              onMouseEnter={(_, index) => setHoveredData({
                name: data[index].name,
                value: data[index].value,
                color: COLORS[index % COLORS.length]
              })}
              onMouseLeave={() => setHoveredData(null)}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  style={{
                    opacity: hoveredData ? (hoveredData.name === entry.name ? 1 : 0.3) : 1,
                    transition: 'opacity 0.2s',
                    outline: 'none'
                  }}
                />
              ))}
            </Pie>
          </PieChart>
          
          <div className={styles.centerText}>
            {hoveredData ? (
              <>
                <div className={styles.totalValue} style={{ color: hoveredData.color }}>
                  €{hoveredData.value.toFixed(2)}
                </div>
                <div className={styles.totalLabel}>{hoveredData.name}</div>
              </>
            ) : (
              <>
                <div className={styles.totalValue}>€{totalSpent.toLocaleString('en-US')}</div>
                <div className={styles.totalLabel}>{t('totalSpent')}</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
