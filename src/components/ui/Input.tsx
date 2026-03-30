'use client'

import React, { forwardRef } from 'react'
import styles from './Input.module.css'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

/**
 * Input — composant atomique typé.
 * Responsabilité unique : afficher un champ de saisie avec son label et son état d'erreur.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className={styles.wrapper}>
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={[styles.input, error ? styles.hasError : '', className ?? ''].join(' ').trim()}
          aria-describedby={error ? `${inputId}-error` : undefined}
          aria-invalid={!!error}
          {...props}
        />
        {error && (
          <span id={`${inputId}-error`} className={styles.error} role="alert">
            {error}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
