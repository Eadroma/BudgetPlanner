'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import styles from './AuthForm.module.css'

interface ForgotPasswordFormProps {
  locale: string
}

export function ForgotPasswordForm({ locale }: ForgotPasswordFormProps) {
  const t = useTranslations('auth.forgotPassword')
  const tErrors = useTranslations('auth.errors')
  const { sendResetEmail } = useAuth()

  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) { setError(tErrors('email_required')); return }
    setIsLoading(true)
    setError(null)
    const { error: authError } = await sendResetEmail(email, locale)
    if (authError) {
      setError(tErrors('generic'))
    } else {
      setSuccess(true)
    }
    setIsLoading(false)
  }

  if (success) {
    return (
      <div className={styles.formWrapper}>
        <div className={styles.successCard}>
          <span className={styles.successIcon}>📬</span>
          <p className={styles.successTitle}>{t('successMsg')}</p>
          <Link href={`/${locale}/login`} className={styles.link}>
            {t('backToLogin')}
          </Link>
        </div>
      </div>
    )
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
          label={t('emailLabel')}
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(null) }}
          autoComplete="email"
          required
        />

        <Button type="submit" size="lg" isLoading={isLoading}>
          {t('submitBtn')}
        </Button>
      </form>

      <p className={styles.switchLink}>
        <Link href={`/${locale}/login`} className={styles.link}>
          {t('backToLogin')}
        </Link>
      </p>
    </div>
  )
}
