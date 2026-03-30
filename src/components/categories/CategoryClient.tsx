'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { 
  Building2, 
  CreditCard, 
  PlaySquare, 
  ShoppingCart, 
  Gamepad2, 
  Coffee, 
  Banknote,
  Receipt,
  Plus,
  Pencil,
  Trash2,
  Check
} from 'lucide-react'
import { useCategories } from '@/hooks/useCategories'
import styles from './CategoryClient.module.css'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import type { Category, TransactionType } from '@/types/transaction'

const PRESET_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
  '#8b5cf6', '#ec4899', '#06b6d4', '#71717a'
]

const CATEGORY_ICONS = [
  { id: 'Building2', Icon: Building2 },
  { id: 'CreditCard', Icon: CreditCard },
  { id: 'PlaySquare', Icon: PlaySquare },
  { id: 'ShoppingCart', Icon: ShoppingCart },
  { id: 'Gamepad2', Icon: Gamepad2 },
  { id: 'Coffee', Icon: Coffee },
  { id: 'Banknote', Icon: Banknote },
  { id: 'Receipt', Icon: Receipt }
]

const getIcon = (id: string) => {
  const item = CATEGORY_ICONS.find(i => i.id === id)
  return item ? <item.Icon size={20} /> : <Receipt size={20} />
}

export function CategoryClient() {
  const { categories, loading, addCategory, editCategory, removeCategory } = useCategories()
  const t = useTranslations('CategoriesPage')
  const tf = useTranslations('TransactionForm')

  const [editingCat, setEditingCat] = useState<Category | null>(null)
  const [deletingCat, setDeletingCat] = useState<Category | null>(null)

  // Form State
  const [name, setName] = useState('')
  const [type, setType] = useState<TransactionType>('expense')
  const [color, setColor] = useState(PRESET_COLORS[0])
  const [iconId, setIconId] = useState('Receipt')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetForm = () => {
    setName('')
    setType('expense')
    setColor(PRESET_COLORS[0])
    setIconId('Receipt')
    setEditingCat(null)
  }

  const handleEditClick = (cat: Category) => {
    setEditingCat(cat)
    setName(cat.name)
    setType(cat.type)
    setColor(cat.color || PRESET_COLORS[0])
    setIconId(cat.icon || 'Receipt')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)
    try {
      if (editingCat) {
        await editCategory(editingCat.id, { name, type, color, icon: iconId })
      } else {
        await addCategory({ name, type, color, icon: iconId })
      }
      resetForm()
    } catch (err) {
      console.error('Failed to save category:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingCat) return
    try {
      await removeCategory(deletingCat.id)
      setDeletingCat(null)
    } catch (err) {
      console.error('Failed to delete:', err)
    }
  }

  if (loading) return <div className={styles.noCategories}>{tf('loading')}</div>

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t('title', { default: 'Category Management' })}</h1>
        <p className={styles.subtitle}>{t('subtitle', { default: 'Manage your financial architecture with custom categories.' })}</p>
      </header>

      <div className={styles.grid}>
        <div className={styles.leftColumn}>
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>
              {editingCat ? t('editTitle', { default: 'Edit Category' }) : t('addTitle', { default: 'Create New Category' })}
            </h2>

            <div className={styles.preview}>
              <div className={styles.previewIcon} style={{ backgroundColor: color }}>
                {getIcon(iconId)}
              </div>
              <div className={styles.previewLabel}>
                {name || (editingCat ? editingCat.name : t('newCategoryTitle', { default: 'New Category' }))}
              </div>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.field}>
                <label className={styles.label}>{tf('category')}</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Travel, Health..."
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>{t('type', { default: 'TYPE' })}</label>
                <select 
                  className={styles.select}
                  value={type}
                  onChange={(e) => setType(e.target.value as TransactionType)}
                >
                  <option value="expense">{tf('expense')}</option>
                  <option value="income">{tf('income')}</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>{t('color', { default: 'COLOR' })}</label>
                <div className={styles.colorPicker}>
                  {PRESET_COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      className={`${styles.colorOption} ${color === c ? styles.colorSelected : ''}`}
                      style={{ backgroundColor: c }}
                      onClick={() => setColor(c)}
                    />
                  ))}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>{t('icon', { default: 'ICON' })}</label>
                <div className={styles.colorPicker}>
                  {CATEGORY_ICONS.map(({ id, Icon }) => (
                    <button
                      key={id}
                      type="button"
                      className={`${styles.actionBtn} ${iconId === id ? styles.colorSelected : ''}`}
                      onClick={() => setIconId(id)}
                      title={id}
                    >
                      <Icon size={18} />
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? '...' : (editingCat ? t('updateBtn', { default: 'Update Category' }) : t('createBtn', { default: 'Create Category' }))}
              </button>
              {editingCat && (
                <Button variant="ghost" onClick={resetForm} type="button">
                  {tf('cancel')}
                </Button>
              )}
            </form>
          </div>
        </div>

        <div className={styles.listColumn}>
          {categories.length === 0 ? (
            <div className={styles.noCategories}>
              <Plus size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p>{t('noCategories', { default: 'No individual categories yet found.' })}</p>
            </div>
          ) : (
            categories.map(cat => (
              <div key={cat.id} className={styles.categoryCard}>
                <div className={styles.categoryInfo}>
                  <div className={styles.iconBox} style={{ backgroundColor: cat.color || '#ccc' }}>
                    {getIcon(cat.icon || 'Receipt')}
                  </div>
                  <div className={styles.catText}>
                    <span className={styles.catName}>{cat.name}</span>
                    <span className={styles.catType}>
                      {cat.type === 'income' ? tf('income') : tf('expense')}
                    </span>
                  </div>
                </div>
                <div className={styles.actions}>
                  <button 
                    className={`${styles.actionBtn} ${styles.editBtn}`}
                    onClick={() => handleEditClick(cat)}
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button 
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                    onClick={() => setDeletingCat(cat)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal
        isOpen={!!deletingCat}
        onClose={() => setDeletingCat(null)}
        title={t('confirmDeleteTitle', { default: 'Delete Category' })}
      >
        <div style={{ padding: '1.5rem' }}>
          <p>{t('confirmDeleteMsg', { default: 'Are you sure you want to delete this category? Linked transactions will be moved to "Miscellaneous".' })}</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setDeletingCat(null)}>{tf('cancel')}</Button>
            <Button 
              variant="primary" 
              onClick={handleDelete}
              style={{ backgroundColor: '#c62828', borderColor: '#c62828' }}
            >
              {t('deleteConfirmBtn', { default: 'Delete Permanently' })}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
