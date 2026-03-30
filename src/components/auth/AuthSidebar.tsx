'use client'

import React from 'react'
import styles from './AuthSidebar.module.css'

interface AuthSidebarProps {
  tagline: string
  description: string
}

/**
 * AuthSidebar — responsabilité unique : afficher le panneau branding gauche
 * de la page d'authentification (logo, tagline, stats).
 */
export function AuthSidebar({ tagline, description }: AuthSidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <span className={styles.logoMark}>⬡</span>
          <span className={styles.logoText}>Echelon Finance</span>
        </div>

        <div className={styles.content}>
          <blockquote className={styles.tagline}>{tagline}</blockquote>
          <p className={styles.description}>{description}</p>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>4.8%</span>
            <span className={styles.statLabel}>APY de base</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statValue}>$2.4B</span>
            <span className={styles.statLabel}>Actifs gérés</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
