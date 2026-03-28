import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'studio_auth'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function POST(request: NextRequest) {
  const { passphrase } = await request.json()
  const expected = process.env.STUDIO_PASSPHRASE

  if (!expected || passphrase !== expected) {
    return NextResponse.json({ error: 'Invalid passphrase' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(COOKIE_NAME, passphrase, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })

  return response
}
