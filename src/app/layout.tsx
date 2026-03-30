import type { Metadata } from 'next'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: 'Echelon Finance',
  description: 'Application de gestion budgétaire personnelle'
}

interface RootLayoutProps {
  children: React.ReactNode
}

/**
 * RootLayout — responsabilité unique : définir la structure HTML racine.
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
