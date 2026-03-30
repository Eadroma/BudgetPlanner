import React, { useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { 
  Building2, 
  CreditCard, 
  PlaySquare, 
  ShoppingCart, 
  Gamepad2, 
  Coffee, 
  Banknote,
  Receipt,
  Filter,
  ArrowUpDown,
  Pencil,
  Trash2
} from 'lucide-react'
import * as Icons from 'lucide-react'
import type { Transaction, Category } from '@/types/transaction'
import { useMembers } from '@/hooks/useMembers'
import styles from './GroupedTransactionList.module.css'

interface GroupedTransactionListProps {
  transactions: Transaction[]
  loading: boolean
  onEdit?: (tx: Transaction) => void
  onDelete?: (tx: Transaction) => void
}

const getCategoryIcon = (category: string, catData?: Category | null) => {
  if (catData?.icon) {
    const IconComponent = (Icons as any)[catData.icon] || Receipt
    return <IconComponent size={24} />
  }
  const cat = category?.toLowerCase() || ''
  if (cat.includes('loyer')) return <Building2 size={24} />
  if (cat.includes('dette')) return <CreditCard size={24} />
  if (cat.includes('abonnement')) return <PlaySquare size={24} />
  if (cat.includes('alimentation')) return <ShoppingCart size={24} />
  if (cat.includes('jeu')) return <Gamepad2 size={24} />
  if (cat.includes('plaisir')) return <Coffee size={24} />
  if (cat.includes('salaire')) return <Banknote size={24} />
  return <Receipt size={24} />
}

const getCategoryTheme = (category: string, type: 'income' | 'expense') => {
  if (type === 'income') return styles.chipIncome
  const cat = category?.toLowerCase() || ''
  if (cat.includes('dette') || cat.includes('loyer')) return styles.chipDanger
  if (cat.includes('abonnement')) return styles.chipNeutral
  return styles.chipGeneric
}

const getIconTheme = (category: string, type: 'income' | 'expense') => {
  if (type === 'income') return styles.iconIncome
  const cat = category?.toLowerCase() || ''
  if (cat.includes('dette') || cat.includes('loyer')) return styles.iconDanger
  if (cat.includes('abonnement')) return styles.iconNeutral
  return styles.iconGeneric
}

export function GroupedTransactionList({ transactions, loading, onEdit, onDelete }: GroupedTransactionListProps) {
  const locale = useLocale()
  const t = useTranslations('Dashboard')

  const [categoryFilter, setCategoryFilter] = useState('all')
  const [monthFilter, setMonthFilter] = useState('all')
  const [memberFilter, setMemberFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState<'desc'|'asc'>('desc')
  const [searchQuery, setSearchQuery] = useState('')
  const { members } = useMembers()

  const formatCurrency = (val: number, type: 'income' | 'expense', forceSign: boolean = false) => {
    const value = type === 'expense' ? -Math.abs(val) : Math.abs(val)
    return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: 'EUR',
      signDisplay: forceSign ? 'always' : 'auto'
    }).format(value)
  }

  const { uniqueCategories, uniqueMonths } = useMemo(() => {
    const cats = new Set<string>()
    const months = new Set<string>()
    transactions.forEach(tx => {
      cats.add(tx.category)
      const date = new Date(tx.date)
      const monthKey = new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
        month: 'long',
        year: 'numeric'
      }).format(date)
      months.add(monthKey)
    })
    return {
      uniqueCategories: Array.from(cats),
      uniqueMonths: Array.from(months)
    }
  }, [transactions, locale])

  const filteredAndGrouped = useMemo(() => {
    // 1. Filter
    let filtered = transactions;
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(tx => tx.category === categoryFilter)
    }
    if (monthFilter !== 'all') {
      filtered = filtered.filter(tx => {
        const date = new Date(tx.date)
        const monthKey = new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
          month: 'long',
          year: 'numeric'
        }).format(date)
        return monthKey === monthFilter
      })
    }
    if (memberFilter !== 'all') {
      filtered = filtered.filter(tx => tx.member_id === memberFilter)
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(tx => 
        (tx.description || '').toLowerCase().includes(q) || 
        tx.category.toLowerCase().includes(q)
      )
    }

    // 2. Group
    const groups: Record<string, { total: number, dateObj: Date, items: Transaction[] }> = {}
    filtered.forEach(tx => {
      const date = new Date(tx.date)
      const monthKey = new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
        month: 'long',
        year: 'numeric'
      }).format(date)
      
      const titleCaseMonth = monthKey.charAt(0).toUpperCase() + monthKey.slice(1)

      if (!groups[titleCaseMonth]) {
        groups[titleCaseMonth] = { total: 0, dateObj: date, items: [] }
      }
      groups[titleCaseMonth].items.push(tx)
      
      const amount = Number(tx.amount)
      groups[titleCaseMonth].total += (tx.type === 'expense' ? -amount : amount)
    })

    // 3. Sort Groups
    const sortedGroups = Object.entries(groups).sort((a, b) => {
      if (sortOrder === 'desc') {
        return b[1].dateObj.getTime() - a[1].dateObj.getTime()
      }
      return a[1].dateObj.getTime() - b[1].dateObj.getTime()
    })

    // 4. Sort Items within groups
    sortedGroups.forEach(group => {
      group[1].items.sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        
        if (dateA !== dateB) {
          return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
        }
        
        // Fallback to created_at
        return sortOrder === 'desc' 
          ? b.created_at.localeCompare(a.created_at)
          : a.created_at.localeCompare(b.created_at)
      })
    })

    return sortedGroups
  }, [transactions, locale, categoryFilter, monthFilter, sortOrder, searchQuery])

  if (loading) {
    return <div className={styles.loading}>{t('loading', { default: 'Loading...' })}</div>
  }

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <div className={styles.selectWrapper}>
            <Filter size={16} className={styles.selectIcon} />
            <select 
              className={styles.toolSelect} 
              value={categoryFilter} 
              onChange={e => setCategoryFilter(e.target.value)}
            >
              <option value="all">{t('category', { default: 'Category' })}</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className={styles.selectWrapper}>
            <Filter size={16} className={styles.selectIcon} />
            <select 
              className={styles.toolSelect} 
              value={monthFilter} 
              onChange={e => setMonthFilter(e.target.value)}
            >
              <option value="all">{t('month', { default: 'Month' })}</option>
              {uniqueMonths.map(m => {
                const titleCase = m.charAt(0).toUpperCase() + m.slice(1)
                return <option key={m} value={m}>{titleCase}</option>
              })}
            </select>
          </div>

          <div className={styles.selectWrapper}>
            <ArrowUpDown size={16} className={styles.selectIcon} />
            <select 
              className={styles.toolSelect} 
              value={sortOrder} 
              onChange={e => setSortOrder(e.target.value as 'asc'|'desc')}
            >
              <option value="desc">{t('newest', { default: 'Date (Newest)' })}</option>
              <option value="asc">{t('oldest', { default: 'Date (Oldest)' })}</option>
            </select>
          </div>

          <div className={styles.selectWrapper}>
            <Filter size={16} className={styles.selectIcon} />
            <select 
              className={styles.toolSelect} 
              value={memberFilter} 
              onChange={e => setMemberFilter(e.target.value)}
            >
              <option value="all">{t('member', { default: 'Member' })}</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.search}>
          <input 
            type="text" 
            placeholder={t('searchPlaceholder', { default: 'Search transactions...' })} 
            className={styles.searchInput}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredAndGrouped.length === 0 && (
        <div className={styles.loading}>{t('noTransactions', { default: 'No transactions found.' })}</div>
      )}

      {filteredAndGrouped.map(([monthString, data]) => (
        <div key={monthString} className={styles.group}>
          <div className={styles.groupHeader}>
            <h2 className={styles.monthTitle}>{monthString}</h2>
            <div className={styles.monthTotal}>
              <span className={styles.totalLabel}>{t('total', { default: 'TOTAL' })}:</span>
              <span className={styles.totalValue}>{formatCurrency(data.total, data.total >= 0 ? 'income' : 'expense')}</span>
            </div>
          </div>
          
          <div className={styles.itemsList}>
            {data.items.map(tx => (
              <div key={tx.id} className={styles.card}>
                <div className={styles.cardLeft}>
                  <div 
                    className={styles.iconBox}
                    style={tx.category_data?.color ? { backgroundColor: `${tx.category_data.color}15`, color: tx.category_data.color } : {}}
                  >
                    {getCategoryIcon(tx.category, tx.category_data)}
                  </div>
                  <div className={styles.textStack}>
                    <div className={styles.titleText}>{tx.description || tx.category}</div>
                    <div className={styles.dateText}>
                      {new Date(tx.date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short' })}
                      {' • '}{tx.type === 'income' ? t('income', { default: 'Income' }) : t('expense', { default: 'Expense' })}
                    </div>
                  </div>
                </div>
                
                <div className={styles.cardRight}>
                  <div className={styles.rightTop}>
                    {(onEdit || onDelete) && (
                      <div className={styles.actionsGroup}>
                        {onEdit && (
                          <button 
                            className={`${styles.actionBtn} ${styles.editBtn}`}
                            onClick={() => onEdit(tx)}
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                        )}
                        {onDelete && (
                          <button 
                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                            onClick={() => onDelete(tx)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    )}
                    <div className={`${styles.amount} ${tx.type === 'income' ? styles.positive : styles.negative}`}>
                      {formatCurrency(tx.amount, tx.type, true)}
                    </div>
                  </div>
                  <div 
                    className={`${styles.chip} ${getCategoryTheme(tx.category, tx.type)}`}
                    style={tx.category_data?.color ? { backgroundColor: `${tx.category_data.color}20`, color: tx.category_data.color } : {}}
                  >
                    {tx.category_data?.name || (tx.type === 'income' ? 'INCOME' : tx.category)}
                  </div>
                  {tx.member && (
                    <div 
                      className={styles.memberBadge}
                      style={{ 
                        backgroundColor: `${tx.member.color}15`,
                        color: tx.member.color,
                        borderColor: `${tx.member.color}30`
                      }}
                    >
                      <span className={styles.badgeDot} style={{ backgroundColor: tx.member.color }} />
                      {tx.member.name}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
