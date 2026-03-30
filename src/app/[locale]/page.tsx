import { redirect } from 'next/navigation'

interface LocalePageProps {
  params: Promise<{ locale: string }>
}

/**
 * Page racine par locale — redirige vers /dashboard.
 * Le middleware redirige vers /login si non authentifié.
 */
export default async function LocalePage({ params }: LocalePageProps) {
  const { locale } = await params;
  redirect(`/${locale}/dashboard`)
}
