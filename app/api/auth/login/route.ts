import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { signToken, getAuthCookieOptions } from '@/lib/auth'

// Basit in-memory rate limiter: 15 dakikada max 10 deneme
const attempts = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = attempts.get(ip)
  if (!entry || entry.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 })
    return true
  }
  if (entry.count >= 10) return false
  entry.count++
  return true
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Çok fazla deneme. 15 dakika sonra tekrar deneyin.' },
      { status: 429 }
    )
  }
  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Kullanıcı adı ve şifre gerekli' }, { status: 400 })
    }

    const adminUsername = process.env.ADMIN_USERNAME ?? 'admin'
    const adminHash     = process.env.ADMIN_PASSWORD_HASH

    if (!adminHash) {
      return NextResponse.json(
        { error: 'Sunucu yapılandırması eksik. ADMIN_PASSWORD_HASH ayarlanmamış.' },
        { status: 500 }
      )
    }

    const usernameMatch = username === adminUsername
    const passwordMatch = await bcrypt.compare(password, adminHash)

    if (!usernameMatch || !passwordMatch) {
      // Timing-safe: ikisi de kontrol ediliyor
      return NextResponse.json({ error: 'Kullanıcı adı veya şifre hatalı' }, { status: 401 })
    }

    const token = await signToken({ username: adminUsername })

    const response = NextResponse.json({ success: true })
    response.cookies.set(getAuthCookieOptions(token))

    return response
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
