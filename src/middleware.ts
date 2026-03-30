import { NextResponse, type NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { createServerClient } from '@supabase/ssr'

const handleI18nRouting = createIntlMiddleware(routing)

export async function middleware(request: NextRequest) {
  // 1. Appliquer le routing i18n pour obtenir la locale (+ redirect si nécessaire)
  const response = handleI18nRouting(request)

  // 2. Créer le client Supabase middleware pour rafraîchir la session
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Mise à jour de la requête pour les prochains middlewares
            request.cookies.set(name, value)
            // Mise à jour de la réponse 
            response.cookies.set({ name, value, ...options })
          })
        },
      },
    }
  )

  // Obtenir l'utilisateur actuel
  const { data: { user } } = await supabase.auth.getUser()

  // 3. Protection des routes
  // Extraire la locale courante ou celle par défaut
  const localeMatch = request.nextUrl.pathname.match(/^\/(fr|en)/)
  const locale = localeMatch ? localeMatch[1] : routing.defaultLocale

  const isAuthRoute = request.nextUrl.pathname.match(/^\/(fr|en)\/(login|register)($|\/)/)
  const isProtectedRoute = request.nextUrl.pathname.match(/^\/(fr|en)\/dashboard($|\/)/)

  // Rediriger vers /login si non authentifié sur une route protégée
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
  }

  // Rediriger vers /dashboard si déjà authentifié sur /login ou /register
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
  }

  return response
}

export const config = {
  // Appliquer le middleware sur toutes les requêtes sauf fichiers statiques, api, _next
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ]
}
