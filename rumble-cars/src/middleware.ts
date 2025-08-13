import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, canAccessRoute, ROUTE_ACCESS } from '@/utils/auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/search',
    '/vehicles',
    '/about',
    '/contact',
    '/terms',
    '/privacy',
    '/api/auth/signup',
    '/api/auth/login',
    '/api/auth/verify-otp',
    '/api/vehicles/search',
  ]

  // Check if it's a public route
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Get token from header or cookie
  const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                request.cookies.get('auth-token')?.value

  if (!token) {
    // Redirect to login for protected routes
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Verify token
  const payload = verifyToken(token)
  if (!payload) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      )
    }
    
    const loginUrl = new URL('/auth/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Check role-based access
  const userRole = payload.role

  // Route-specific access control
  if (pathname.startsWith('/admin')) {
    if (!canAccessRoute(userRole, ROUTE_ACCESS.admin)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
  }

  if (pathname.startsWith('/staff')) {
    if (!canAccessRoute(userRole, ROUTE_ACCESS.staff)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
  }

  if (pathname.startsWith('/host')) {
    if (!canAccessRoute(userRole, ROUTE_ACCESS.host)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
  }

  // API route protection
  if (pathname.startsWith('/api/admin') && !canAccessRoute(userRole, ROUTE_ACCESS.admin)) {
    return NextResponse.json(
      { success: false, error: 'Admin access required' },
      { status: 403 }
    )
  }

  if (pathname.startsWith('/api/staff') && !canAccessRoute(userRole, ROUTE_ACCESS.staff)) {
    return NextResponse.json(
      { success: false, error: 'Staff access required' },
      { status: 403 }
    )
  }

  if (pathname.startsWith('/api/host') && !canAccessRoute(userRole, ROUTE_ACCESS.host)) {
    return NextResponse.json(
      { success: false, error: 'Host access required' },
      { status: 403 }
    )
  }

  // Add user info to request headers for API routes
  if (pathname.startsWith('/api/')) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', payload.userId)
    requestHeaders.set('x-user-role', payload.role)
    requestHeaders.set('x-user-email', payload.email)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}