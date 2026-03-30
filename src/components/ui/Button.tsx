'use client'

import React from 'react'
import styles from './Button.module.css'

type ButtonVariant = 'primary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  fullWidth?: boolean
  children: React.ReactNode
}

/**
 * Button — composant atomique typé.
 * Responsabilité unique : afficher un bouton avec ses états visuels.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  children,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    isLoading ? styles.loading : '',
    fullWidth ? styles.fullWidth : '',
    className ?? ''
  ].join(' ').trim()

  return (
    <button
      className={classes}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? <LoadingDots /> : children}
    </button>
  )
}

function LoadingDots() {
  return <span className={styles.dots} aria-hidden="true">···</span>
}
