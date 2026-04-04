import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  AUTH_ACCESS_TOKEN_COOKIE,
  AUTH_REFRESH_TOKEN_COOKIE,
  verifyAccessToken
} from './src/lib/supabaseClient'

// protectedPrefixes define las rutas que requieren autenticación. Cualquier ruta que comience con uno de estos prefijos será protegida por el middleware.
const protectedPrefixes = ['/finanzas', '/carteras', '/presupuestos']
const publicAuthPaths = ['/login', '/register']

const isProtectedPath = (pathname: string): boolean => (
  protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
)

const isPublicAuthPath = (pathname: string): boolean => publicAuthPaths.includes(pathname)

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isProtected = isProtectedPath(pathname)
  const isPublicAuth = isPublicAuthPath(pathname)

  if (!isProtected && !isPublicAuth) {
    return NextResponse.next()
  }

  const accessToken = request.cookies.get(AUTH_ACCESS_TOKEN_COOKIE)?.value

  if (!accessToken) {
    if (isPublicAuth) {
      return NextResponse.next()
    }

    return NextResponse.redirect(new URL('/login', request.url))
  }

  const isValidSession = await verifyAccessToken(accessToken)

  if (!isValidSession) {
    const response = isProtected
      ? NextResponse.redirect(new URL('/login', request.url))
      : NextResponse.next()

    response.cookies.delete(AUTH_ACCESS_TOKEN_COOKIE)
    response.cookies.delete(AUTH_REFRESH_TOKEN_COOKIE)
    return response
  }

  if (isPublicAuth) {
    return NextResponse.redirect(new URL('/finanzas', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/register', '/finanzas/:path*', '/carteras/:path*', '/presupuestos/:path*']
}
