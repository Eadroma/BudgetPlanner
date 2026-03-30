'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import styles from './AuthForm.module.css'

interface ResetPasswordFormProps {
  locale: string
}

export function ResetPasswordForm({ locale }: ResetPasswordFormProps) {
  const t = useTranslations('auth.resetPassword')
  const tErrors = useTranslations('auth.errors')
  const { updatePassword } = useAuth()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { setError(tErrors('password_too_short')); return }
    if (password !== confirm) { setError(tErrors('passwords_mismatch')); return }

    setIsLoading(true)
    setError(null)
    const { error: authError } = await updatePassword(password, locale)
    if (authError) {
      setError(tErrors('generic'))
      setIsLoading(false)
    }
    // on success: useAuth redirects to /login, no further action needed
  }

  return (
    <div className={styles.formWrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.subtitle}>{t('subtitle')}</p>
      </header>

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        {error && (
          <div className={styles.globalError} role="alert">
            {error}
          </div>
        )}

        <Input
          label={t('newPasswordLabel')}
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(null) }}
          autoComplete="new-password"
          required
        />

        <Input
          label={t('confirmPasswordLabel')}
          type="password"
          placeholder="••••••••"
          value={confirm}
          onChange={(e) => { setConfirm(e.target.value); setError(null) }}
          autoComplete="new-password"
          required
        />

        <Button type="submit" size="lg" isLoading={isLoading}>
          {t('submitBtn')}
        </Button>
      </form>
    </div>
  )
}
