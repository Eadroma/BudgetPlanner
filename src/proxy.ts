import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'

// Middleware next-intl pour la gestion des locales
const intlMiddleware = createIntlMiddleware(routing)

// Routes protégées (nécessitent une session active)
const PROTECTED_ROUTES = ['/dashboard']

// Routes d'auth (redirigent vers dashboard si déjà connecté)
const AUTH_ROUTES = ['/login', '/register']

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route =>
    pathname.match(new RegExp(`^/[a-z]{2}${route}(/.*)?$`))
  )
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(route =>
    pathname.match(new RegExp(`^/[a-z]{2}${route}(/.*)?$`))
  )
}

export async function proxy(request: NextRequest) {
  // Appliquer l'intl middleware d'abord
  const intlResponse = intlMiddleware(request)

  // Gérer les cookies Supabase via le middleware
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        }
      }
    }
  )

  // Récupérer la session (ne pas supprimer ce await)
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const locale = pathname.split('/')[1] || routing.defaultLocale

  // Redirection si route protégée et non authentifié
  if (isProtectedRoute(pathname) && !user) {
    const loginUrl = new URL(`/${locale}/login`, request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirection si route auth et déjà authentifié
  if (isAuthRoute(pathname) && user) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
  }

  // Fusionner les cookies Supabase avec la réponse intl
  intlResponse.cookies.getAll().forEach(cookie => {
    supabaseResponse.cookies.set(cookie.name, cookie.value)
  })

  return supabaseResponse
}

export const config = {
  matcher: [
    // Exclure les fichiers statiques et API Next.js
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
}
