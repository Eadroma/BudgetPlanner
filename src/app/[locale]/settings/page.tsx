'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { UserPlus, Trash2, ShieldCheck, CreditCard, Bell, Star } from 'lucide-react'
import { useMembers } from '@/hooks/useMembers'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import styles from './Settings.module.css'

export default function SettingsPage() {
  const t = useTranslations('SettingsPage')
  const { members, addMember, deleteMember, setDefaultMember, isLoading } = useMembers()
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberColor, setNewMemberColor] = useState('#3b82f6')
  const [isAdding, setIsAdding] = useState(false)

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMemberName.trim()) return
    
    setIsAdding(true)
    try {
      await addMember(newMemberName, newMemberColor)
      setNewMemberName('')
    } catch (err) {
      console.error(err)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.subtitle}>{t('subtitle')}</p>
      </header>

      <div className={styles.grid}>
        {/* Household Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <UserPlus size={20} />
            </div>
            <div>
              <h2 className={styles.sectionTitle}>{t('householdTitle')}</h2>
              <p className={styles.sectionSubtitle}>{t('householdSubtitle')}</p>
            </div>
          </div>

          <form onSubmit={handleAddMember} className={styles.addMemberForm}>
            <div className={styles.inputGroup}>
              <Input
                placeholder={t('memberNamePlaceholder')}
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                disabled={isAdding}
              />
              <div className={styles.colorPickerWrapper}>
                <input
                  type="color"
                  className={styles.colorPicker}
                  value={newMemberColor}
                  onChange={(e) => setNewMemberColor(e.target.value)}
                  disabled={isAdding}
                />
              </div>
              <Button type="submit" disabled={isAdding || !newMemberName}>
                {isAdding ? '...' : t('addBtn')}
              </Button>
            </div>
          </form>

          <div className={styles.memberList}>
            {isLoading ? (
              <div className={styles.loading}>{t('loading')}</div>
            ) : members.length === 0 ? (
              <div className={styles.empty}>{t('noMembers')}</div>
            ) : (
              members.map((member) => (
                <div key={member.id} className={styles.memberItem}>
                  <div className={styles.memberInfo}>
                    <div 
                      className={styles.memberAvatar} 
                      style={{ backgroundColor: member.color }}
                    >
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <span className={styles.memberName}>{member.name}</span>
                    {member.is_default && (
                      <span className={styles.defaultBadge}>
                        <Star size={10} fill="currentColor" />
                        {t('defaultBadge')}
                      </span>
                    )}
                  </div>
                  <div className={styles.memberActions}>
                    {!member.is_default && (
                      <button 
                        onClick={() => setDefaultMember(member.id)}
                        className={styles.starBtn}
                        title={t('setDefault')}
                      >
                        <Star size={16} />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteMember(member.id)}
                      className={styles.deleteBtn}
                      title={t('delete')}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Placeholder Sections for Premium Look */}
        <section className={styles.sectionDisabled}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className={styles.sectionTitle}>{t('securityTitle')}</h2>
              <p className={styles.sectionSubtitle}>{t('securitySubtitle')}</p>
            </div>
          </div>
          <div className={styles.lockedBadge}>PRO</div>
        </section>

        <section className={styles.sectionDisabled}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <Bell size={20} />
            </div>
            <div>
              <h2 className={styles.sectionTitle}>{t('notificationsTitle')}</h2>
              <p className={styles.sectionSubtitle}>{t('notificationsSubtitle')}</p>
            </div>
          </div>
          <div className={styles.lockedBadge}>PRO</div>
        </section>
      </div>
    </div>
  )
}
