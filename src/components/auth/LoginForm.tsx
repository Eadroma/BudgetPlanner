'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import type { LoginCredentials } from '@/types/auth'
import styles from './AuthForm.module.css'

interface LoginFormProps {
  locale: string
}

/**
 * LoginForm — responsabilité unique : gérer l'état et la soumission du formulaire de connexion.
 */
export function LoginForm({ locale }: LoginFormProps) {
  const t = useTranslations('auth.login')
  const tErrors = useTranslations('auth.errors')
  const { signIn } = useAuth()

  const [credentials, setCredentials] = useState<LoginCredentials>({ email: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  function handleChange(field: keyof LoginCredentials) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setCredentials(prev => ({ ...prev, [field]: e.target.value }))
      setError(null)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!credentials.email) { setError(tErrors('email_required')); return }
    if (!credentials.password) { setError(tErrors('password_required')); return }

    setIsLoading(true)
    const { error: authError } = await signIn(credentials, locale)
    if (authError) {
      setError(tErrors('invalid_credentials'))
    }
    setIsLoading(false)
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
          label={t('email')}
          type="email"
          placeholder={t('email_placeholder')}
          value={credentials.email}
          onChange={handleChange('email')}
          autoComplete="email"
          required
        />

        <div className={styles.passwordGroup}>
          <Input
            label={t('password')}
            type="password"
            placeholder={t('password_placeholder')}
            value={credentials.password}
            onChange={handleChange('password')}
            autoComplete="current-password"
            required
          />
          <Link href={`/${locale}/forgot-password`} className={styles.forgotLink}>
            {t('forgot_password')}
          </Link>
        </div>

        <Button type="submit" size="lg" isLoading={isLoading}>
          {t('submit')}
        </Button>
      </form>

      <p className={styles.switchLink}>
        {t('no_account')}{' '}
        <Link href={`/${locale}/register`} className={styles.link}>
          {t('sign_up_link')}
        </Link>
      </p>
    </div>
  )
}
