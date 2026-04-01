import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'studio_auth'

export function proxy(request: NextRequest) {
  const cookie = request.cookies.get(COOKIE_NAME)
  const passphrase = process.env.STUDIO_PASSPHRASE

  if (!passphrase || cookie?.value !== passphrase) {
    const loginUrl = new URL('/studio-login', request.url)
    loginUrl.searchParams.set('from', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/studio/:path*'],
}
