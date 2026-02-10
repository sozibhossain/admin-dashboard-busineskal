import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const publicPaths = [
  '/auth/login',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/enter-otp',
]

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const isPublicPath = publicPaths.includes(pathname)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  // Redirect to login if no session and trying to access protected route
  if (!token && !isPublicPath && !pathname.startsWith('/api/auth')) {
    const loginUrl = new URL('/auth/login', req.nextUrl.origin)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to dashboard if logged in and trying to access auth pages
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl.origin))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
