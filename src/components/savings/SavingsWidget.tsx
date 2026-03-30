'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { PiggyBank, Plane, Home, Car, GraduationCap, Heart, ShieldCheck, Laptop, Gift, Wallet } from 'lucide-react'
import { useSavings } from '@/hooks/useSavings'
import styles from './SavingsWidget.module.css'

const ICON_MAP: Record<string, React.FC<{ size?: number; color?: string }>> = {
  PiggyBank, Plane, Home, Car, GraduationCap, Heart, ShieldCheck, Laptop, Gift, Wallet,
}

export function SavingsWidget() {
  const t = useTranslations('SavingsWidget')
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'fr'
  const { summary, loading } = useSavings()

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <PiggyBank size={18} className={styles.titleIcon} />
          <span className={styles.title}>{t('title')}</span>
        </div>
        <Link href={`/${locale}/savings`} className={styles.viewAll}>
          {t('viewAll')}
        </Link>
      </div>

      {loading ? (
        <div className={styles.loading}>{t('loading')}</div>
      ) : (
        <>
          <div className={styles.totalSection}>
            <span className={styles.totalLabel}>{t('totalSaved')}</span>
            <span className={styles.totalAmount}>{formatAmount(summary.totalSaved)}</span>
          </div>

          {summary.potCount === 0 ? (
            <div className={styles.empty}>
              <Link href={`/${locale}/savings`} className={styles.createLink}>
                {t('createFirst')}
              </Link>
            </div>
          ) : (
            <div className={styles.potList}>
              {summary.topPots.map(pot => {
                const Icon = ICON_MAP[pot.icon] || PiggyBank
                const progress = pot.target_amount && pot.target_amount > 0
                  ? Math.min(100, ((pot.current_amount ?? 0) / pot.target_amount) * 100)
                  : null

                return (
                  <div key={pot.id} className={styles.potRow}>
                    <div className={styles.potIcon} style={{ backgroundColor: pot.color + '22' }}>
                      <Icon size={14} color={pot.color} />
                    </div>
                    <div className={styles.potInfo}>
                      <div className={styles.potTopRow}>
                        <span className={styles.potName}>{pot.name}</span>
                        <span className={styles.potAmount}>{formatAmount(pot.current_amount ?? 0)}</span>
                      </div>
                      {progress !== null && (
                        <div className={styles.miniBar}>
                          <div
                            className={styles.miniBarFill}
                            style={{ width: `${progress}%`, backgroundColor: pot.color }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
