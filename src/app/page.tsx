import { redirect } from 'next/navigation'

/**
 * Root page — redirige vers la locale par défaut (fr).
 */
export default function RootPage() {
  redirect('/fr')
}
