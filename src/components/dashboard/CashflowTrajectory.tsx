'use client'

import React, { useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts'
import type { Transaction } from '@/types/transaction'
import styles from './CashflowTrajectory.module.css'

interface CashflowTrajectoryProps {
  transactions: Transaction[]
}

export function CashflowTrajectory({ transactions }: CashflowTrajectoryProps) {
  const t = useTranslations('Dashboard')
  const locale = useLocale()

  const chartData = useMemo(() => {
    // Group by month
    const monthlyStats: Record<string, { name: string; income: number; expense: number; monthSort: number }> = {}

    transactions.forEach(tx => {
      const date = new Date(tx.date)
      const monthIndex = date.getMonth()
      const year = date.getFullYear()
      const key = `${year}-${monthIndex}`
      
      if (!monthlyStats[key]) {
        // Automatically localize month names (JAN, FÉV, etc.)
        const monthName = new Intl.DateTimeFormat(locale, { month: 'short' }).format(date).toUpperCase()
        
        monthlyStats[key] = {
          name: monthName,
          monthSort: date.getTime(),
          income: 0,
          expense: 0
        }
      }

      const amount = Number(tx.amount)
      if (tx.type === 'income') {
        monthlyStats[key].income += amount
      } else {
        monthlyStats[key].expense += amount
      }
    })

    return Object.values(monthlyStats)
      .sort((a, b) => a.monthSort - b.monthSort)
      .slice(-6) // Only show last 6 months to match design
  }, [transactions, locale])

  if (transactions.length === 0) return null

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{t('cashflowTrajectory')}</h3>
          <p className={styles.subtitle}>{t('comparativeAnalysis')}</p>
        </div>
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={styles.colorBox} style={{ backgroundColor: 'var(--color-primary)' }} />
            <span className={styles.legendText}>{t('income').toUpperCase()}</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.colorBox} style={{ backgroundColor: 'var(--color-tertiary-fixed)' }} />
            <span className={styles.legendText}>{t('expense').toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }} barGap={0}>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 11, fontFamily: 'var(--font-inter)', fontWeight: 600 }}
              dy={10}
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              formatter={(value: any) => `€${Number(value).toFixed(2)}`}
            />
            <Bar dataKey="income" fill="var(--color-primary)" radius={[2, 2, 0, 0]} barSize={24} />
            <Bar dataKey="expense" fill="var(--color-tertiary-fixed)" radius={[2, 2, 0, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
