import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // /admin/login ve /api/auth/* koruma dışı
  if (
    pathname === '/admin/login' ||
    pathname.startsWith('/api/auth/')
  ) {
    return NextResponse.next()
  }

  // /admin/* ve /api/admin/* koru
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const jwtSecretStr = process.env.JWT_SECRET
    if (!jwtSecretStr) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Sunucu yapılandırması eksik' }, { status: 500 })
      }
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    const JWT_SECRET = new TextEncoder().encode(jwtSecretStr)
    const token = request.cookies.get('yg-auth')?.value

    if (!token) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      await jwtVerify(token, JWT_SECRET)
      return NextResponse.next()
    } catch {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Geçersiz oturum' }, { status: 401 })
      }
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.delete('yg-auth')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
