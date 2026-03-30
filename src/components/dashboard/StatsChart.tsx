'use client'

import React, { useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { Transaction } from '@/types/transaction'

interface StatsChartProps {
  transactions: Transaction[]
}

/**
 * Architectural Ledger Spec: Performance Sparklines
 * 2px stroke-width lines against surface_container_low background.
 */
export function StatsChart({ transactions }: StatsChartProps) {
  const t = useTranslations('Dashboard')
  const locale = useLocale()

  // Transformer les données pour le graphique (Agréger par jour)
  const chartData = useMemo(() => {
    const dailyStats: Record<string, { date: string; income: number; expense: number }> = {}

    transactions.forEach((tx) => {
      // Group by date (YYYY-MM-DD)
      const dateStr = tx.date
      if (!dailyStats[dateStr]) {
        dailyStats[dateStr] = { date: dateStr, income: 0, expense: 0 }
      }
      
      const amount = Number(tx.amount)
      if (tx.type === 'income') {
        dailyStats[dateStr].income += amount
      } else {
        dailyStats[dateStr].expense += amount
      }
    })

    const sortedData = Object.values(dailyStats).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    
    // Si un seul point de donnée, ajouter un point vide artificiel la veille pour tracer une ligne
    if (sortedData.length === 1) {
      const singleDate = new Date(sortedData[0].date)
      singleDate.setDate(singleDate.getDate() - 1)
      const prevDateStr = singleDate.toISOString().split('T')[0]
      return [
        { date: prevDateStr, income: 0, expense: 0 },
        sortedData[0]
      ]
    }
    
    return sortedData
  }, [transactions])

  if (transactions.length === 0) {
    return null
  }

  // Format de la date (ex: 12 Mar)
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div style={{
      backgroundColor: 'var(--color-surface-container-low)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.5rem',
      height: '300px',
      border: '1px solid var(--color-outline-variant)'
    }}>
      <h3 style={{
        fontFamily: 'var(--font-manrope)',
        fontSize: '1rem',
        fontWeight: 600,
        color: 'var(--color-on-surface)',
        marginBottom: '1rem'
      }}>
        {t('performanceTitle', { default: 'Performance financière' })}
      </h3>
      
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" opacity={0.5} />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
            tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 12, fontFamily: 'var(--font-inter)' }}
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis 
            tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 12, fontFamily: 'var(--font-inter)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value}€`}
            width={60}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--color-surface)', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-outline-variant)',
              fontFamily: 'var(--font-inter)',
              fontSize: '0.875rem'
            }}
            labelFormatter={(label: any) => label ? formatDate(label) : ''}
          />
          <Line 
            type="monotone" 
            dataKey="income" 
            name={t('income', { default: 'Revenus' })}
            stroke="#006c49" /* secondary */
            strokeWidth={2} 
            dot={false}
            activeDot={{ r: 4, fill: '#006c49' }}
          />
          <Line 
            type="monotone" 
            dataKey="expense" 
            name={t('expense', { default: 'Dépenses' })}
            stroke="#ba1a1a" /* error / tertiary */
            strokeWidth={2} 
            dot={false}
            activeDot={{ r: 4, fill: '#ba1a1a' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
