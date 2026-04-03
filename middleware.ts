import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { AUTH_ACCESS_TOKEN_COOKIE, verifyAccessToken } from './backend/lib/auth.server'

// protectedPrefixes define las rutas que requieren autenticación. Cualquier ruta que comience con uno de estos prefijos será protegida por el middleware.
const protectedPrefixes = ['/finanzas', '/carteras', '/presupuestos']

const isProtectedPath = (pathname: string): boolean => (
  protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
)

export async function middleware(request: NextRequest) {
  if (!isProtectedPath(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  const accessToken = request.cookies.get(AUTH_ACCESS_TOKEN_COOKIE)?.value

  if (!accessToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const isValidSession = await verifyAccessToken(accessToken)

  if (!isValidSession) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete(AUTH_ACCESS_TOKEN_COOKIE)
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/finanzas/:path*', '/carteras/:path*', '/presupuestos/:path*']
}
