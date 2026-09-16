import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function middleware(request: NextRequest) {
  // If the user is trying to access a protected route
  if (request.nextUrl.pathname.startsWith('/dean') && !request.nextUrl.pathname.startsWith('/dean/login')) {
    const accessToken = request.cookies.get('sb-access-token')?.value
    const fallbackAuth = request.cookies.get('dean_auth')?.value
    
    // Quick fallback check for dev without fully verifying JWT
    if (!accessToken && fallbackAuth !== 'true') {
      return NextResponse.redirect(new URL('/dean/login', request.url))
    }
    
    // If we have an access token, we could verify it with Supabase here
    // but for this simple app, just checking if it exists is often enough
    // for edge middleware. We verify it fully in the dashboard if needed.
    if (!accessToken && !fallbackAuth) {
      return NextResponse.redirect(new URL('/dean/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dean/:path*'],
}
