import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase environment is not yet configured, allow viewing for initial setup
  const isConfigured = Boolean(
    url &&
    url !== 'https://your-project-ref.supabase.co' &&
    anonKey &&
    anonKey !== 'your-anon-publishable-key'
  )

  if (!isConfigured) {
    return supabaseResponse
  }

  const supabase = createServerClient(url!, anonKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isAuthPage = path.startsWith('/login') || path.startsWith('/auth')
  const isPublicAsset =
    path.startsWith('/_next') ||
    path.startsWith('/favicon.ico') ||
    path.includes('.')

  // Strict invite-only protection: redirect unauthenticated requests to login
  if (!user && !isAuthPage && !isPublicAsset) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    return NextResponse.redirect(redirectUrl)
  }

  // If authenticated and visiting /login, redirect to the cottage home
  if (user && isAuthPage && !path.startsWith('/auth/callback')) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/'
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}
