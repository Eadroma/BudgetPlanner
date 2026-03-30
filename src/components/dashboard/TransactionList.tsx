import React from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { 
  ArrowRight, 
  Pencil,
  Trash2,
  Building2, 
  CreditCard, 
  PlaySquare, 
  ShoppingCart, 
  Gamepad2, 
  Coffee, 
  Banknote,
  Receipt
} from 'lucide-react'
import * as Icons from 'lucide-react'
import type { Transaction, Category } from '@/types/transaction'
import { useMembers } from '@/hooks/useMembers'
import styles from './TransactionList.module.css'

interface TransactionListProps {
  transactions: Transaction[]
  loading: boolean
  limit?: number
  showViewAll?: boolean
  memberFilter?: string
  onMemberFilterChange?: (id: string) => void
  onEdit?: (tx: Transaction) => void
  onDelete?: (tx: Transaction) => void
}

const getCategoryIcon = (category: string, catData?: Category | null) => {
  if (catData?.icon) {
    const IconComponent = (Icons as any)[catData.icon] || Receipt
    return <IconComponent size={20} />
  }
  const cat = category?.toLowerCase() || ''
  if (cat.includes('loyer')) return <Building2 size={20} />
  if (cat.includes('dette')) return <CreditCard size={20} />
  if (cat.includes('abonnement')) return <PlaySquare size={20} />
  if (cat.includes('alimentation')) return <ShoppingCart size={20} />
  if (cat.includes('jeu')) return <Gamepad2 size={20} />
  if (cat.includes('plaisir')) return <Coffee size={20} />
  if (cat.includes('salaire')) return <Banknote size={20} />
  return <Receipt size={20} />
}

const getCategoryTheme = (category: string, type: 'income' | 'expense') => {
  if (type === 'income') return styles.chipIncome
  const cat = category?.toLowerCase() || ''
  if (cat.includes('dette') || cat.includes('loyer')) return styles.chipDanger
  if (cat.includes('abonnement')) return styles.chipNeutral
  return styles.chipGeneric
}

export const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  loading,
  limit,
  showViewAll = false,
  memberFilter = 'all',
  onMemberFilterChange,
  onEdit,
  onDelete
}) => {
  const t = useTranslations('Dashboard')
  const locale = useLocale()
  const { members } = useMembers()

  const formatCurrency = (val: number, type: 'income' | 'expense') => {
    const value = type === 'expense' ? -Math.abs(val) : Math.abs(val)
    return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: 'EUR',
      signDisplay: 'always'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filtered = React.useMemo(() => {
    if (memberFilter === 'all') return transactions
    return transactions.filter(tx => tx.member_id === memberFilter)
  }, [transactions, memberFilter])

  if (loading) {
    return <div className={styles.loading}>{t('loading', { default: 'Loading...' })}</div>
  }

  const displayTransactions = limit ? filtered.slice(0, limit) : filtered

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>{t('recentActivity')}</h3>
        <div className={styles.chipset}>
          <button 
            className={`${styles.filterChip} ${memberFilter === 'all' ? styles.filterChipActive : ''}`}
            onClick={() => onMemberFilterChange?.('all')}
          >
             <div className={styles.chipDot} />
             {t('all', { default: 'All' })}
          </button>
          {members.map(m => (
            <button 
              key={m.id}
              className={`${styles.filterChip} ${memberFilter === m.id ? styles.filterChipActive : ''}`}
              onClick={() => onMemberFilterChange?.(m.id)}
            >
               <div className={styles.chipDot} style={{ backgroundColor: m.color }} />
               {m.name}
            </button>
          ))}
        </div>
        {showViewAll && (
          <Link href={`/${locale}/transactions`} className={styles.viewAllBtn}>
            <span>{t('viewLedger')}</span>
          </Link>
        )}
      </div>
      <div className={styles.list}>
        {displayTransactions.map((tx) => (
          <div key={tx.id} className={styles.item}>
            <div className={styles.itemLeft}>
              <div 
                className={styles.iconBox}
                style={tx.category_data?.color ? { backgroundColor: `${tx.category_data.color}15`, color: tx.category_data.color, borderColor: `${tx.category_data.color}30` } : {}}
              >
                {getCategoryIcon(tx.category, tx.category_data)}
              </div>
              <div className={styles.textStack}>
                <div className={styles.descText}>{tx.description || tx.category}</div>
                <div className={styles.dateText}>{formatDate(tx.date)}</div>
              </div>
            </div>
            
            <div className={styles.itemRight}>
              <div className={styles.rightTop}>
                {(onEdit || onDelete) && (
                  <div className={styles.actionsGroup}>
                    {onEdit && (
                      <button 
                        className={`${styles.actionBtn} ${styles.editBtn}`}
                        onClick={() => onEdit(tx)}
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                    )}
                    {onDelete && (
                      <button 
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        onClick={() => onDelete(tx)}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                )}
                <div
                  className={`${styles.amount} ${tx.type === 'income' ? styles.positive : styles.negative}`}
                >
                  {formatCurrency(tx.amount, tx.type)}
                </div>
              </div>
              <div 
                className={`${styles.categoryChip} ${getCategoryTheme(tx.category, tx.type)}`}
                style={tx.category_data?.color ? { backgroundColor: `${tx.category_data.color}20`, color: tx.category_data.color } : {}}
              >
                {tx.category_data?.name || (tx.type === 'income' ? 'INCOME' : tx.category)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
