import { createServerClient } from '@supabase/ssr'
import { shouldUseMockAuth } from '@/lib/mock-auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { handleCorsPreflight, applyCorsHeaders, applySecurityHeaders } from '@/lib/utils/security-headers'

export async function middleware(req: NextRequest) {
  // Handle CORS preflight requests
  const corsResponse = handleCorsPreflight(req)
  if (corsResponse) {
    return corsResponse
  }

  const res = NextResponse.next()
  
  // Apply security headers to all responses
  applySecurityHeaders(res)
  
  // Apply CORS headers for API routes
  if (req.nextUrl.pathname.startsWith('/api/')) {
    applyCorsHeaders(res)
  }

  const useMock = shouldUseMockAuth()
  if (!useMock) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return req.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            res.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: any) {
            res.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    const {
      data: { session },
    } = await supabase.auth.getSession()

    const protectedPaths = ['/dashboard', '/profile', '/settings', '/admin']
    const isProtectedPath = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))
    
    if (!session && isProtectedPath) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/auth/signin'
      redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    if (session && req.nextUrl.pathname.startsWith('/auth')) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/dashboard'
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}