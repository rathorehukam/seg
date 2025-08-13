import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from './lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Public routes that don't require authentication
  const publicRoutes = [
    '/', '/login', '/signup', '/vehicles/search', '/api/auth/signup', 
    '/api/auth/login', '/api/auth/otp', '/api/vehicles/search'
  ]
  
  // Webhook routes (handle separately)
  if (pathname.startsWith('/api/webhooks/')) {
    return NextResponse.next()
  }
  
  // Check if route is public
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }
  
  // Get token from Authorization header or cookie
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '') || request.cookies.get('auth-token')?.value
  
  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Verify JWT token
  const payload = verifyJWT(token)
  if (!payload) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Role-based route protection
  const { role } = payload
  
  // Admin routes
  if (pathname.startsWith('/admin') && role !== 'ADMIN') {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  // Staff routes
  if (pathname.startsWith('/staff') && !['ADMIN', 'STAFF'].includes(role)) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  // Host routes
  if (pathname.startsWith('/host') && !['ADMIN', 'HOST'].includes(role)) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  // Add user info to request headers for API routes
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-id', payload.userId)
  requestHeaders.set('x-user-role', payload.role)
  requestHeaders.set('x-user-phone', payload.phone)
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}