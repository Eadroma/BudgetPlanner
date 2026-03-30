import React from 'react'
import { AuthSidebar } from './AuthSidebar'
import styles from './AuthCard.module.css'

interface AuthCardProps {
  sidebarTagline: string
  sidebarDescription: string
  children: React.ReactNode
}

/**
 * AuthCard — responsabilité unique : composer le layout split-screen
 * (sidebar gauche + panneau formulaire droit).
 */
export function AuthCard({ sidebarTagline, sidebarDescription, children }: AuthCardProps) {
  return (
    <main className={styles.card}>
      <div className={styles.sidebar}>
        <AuthSidebar tagline={sidebarTagline} description={sidebarDescription} />
      </div>
      <div className={styles.formPanel}>
        {children}
      </div>
    </main>
  )
}
