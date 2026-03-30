'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import type { RegisterData } from '@/types/auth'
import styles from './AuthForm.module.css'

interface RegisterFormProps {
  locale: string
}

/**
 * RegisterForm — responsabilité unique : gérer l'état et la soumission du formulaire d'inscription.
 */
export function RegisterForm({ locale }: RegisterFormProps) {
  const t = useTranslations('auth.register')
  const tErrors = useTranslations('auth.errors')
  const { signUp } = useAuth()

  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [fieldErrors, setFieldErrors] = useState<Partial<RegisterData>>({})
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  function handleChange(field: keyof RegisterData) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }))
      setFieldErrors(prev => ({ ...prev, [field]: undefined }))
      setGlobalError(null)
    }
  }

  function validate(): boolean {
    const errors: Partial<RegisterData> = {}
    if (!formData.email) errors.email = tErrors('email_required')
    if (!formData.password) errors.password = tErrors('password_required')
    else if (formData.password.length < 8) errors.password = tErrors('password_too_short')
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = tErrors('passwords_mismatch')
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    const { error, needsEmailConfirmation } = await signUp(formData, locale)

    if (error) {
      setGlobalError(
        error.code === 'user_already_exists'
          ? tErrors('email_already_used')
          : tErrors('generic')
      )
    } else if (needsEmailConfirmation) {
      setSuccessMessage(t('success'))
    }
    setIsLoading(false)
  }

  if (successMessage) {
    return (
      <div className={styles.formWrapper}>
        <div className={styles.successCard}>
          <span className={styles.successIcon}>✉️</span>
          <h2 className={styles.successTitle}>{successMessage}</h2>
          <p className={styles.successText}>
            Vérifiez votre boîte email pour confirmer votre compte.
          </p>
          <Link href={`/${locale}/login`} className={styles.link}>
            Retour à la connexion
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
        {globalError && (
          <div className={styles.globalError} role="alert">
            {globalError}
          </div>
        )}

        <Input
          label={t('email')}
          type="email"
          placeholder={t('email_placeholder')}
          value={formData.email}
          onChange={handleChange('email')}
          error={fieldErrors.email}
          autoComplete="email"
          required
        />

        <Input
          label={t('password')}
          type="password"
          placeholder={t('password_placeholder')}
          value={formData.password}
          onChange={handleChange('password')}
          error={fieldErrors.password}
          autoComplete="new-password"
          required
        />

        <Input
          label={t('confirm_password')}
          type="password"
          placeholder={t('confirm_password_placeholder')}
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          error={fieldErrors.confirmPassword}
          autoComplete="new-password"
          required
        />

        <Button type="submit" size="lg" isLoading={isLoading}>
          {t('submit')}
        </Button>

        <p className={styles.termsText}>
          <Link href={`/${locale}/terms`} className={styles.link}>{t('terms')}</Link>
          {' · '}
          <Link href={`/${locale}/privacy`} className={styles.link}>{t('privacy')}</Link>
        </p>
      </form>

      <p className={styles.switchLink}>
        {t('already_account')}{' '}
        <Link href={`/${locale}/login`} className={styles.link}>
          {t('login_link')}
        </Link>
      </p>
    </div>
  )
}
