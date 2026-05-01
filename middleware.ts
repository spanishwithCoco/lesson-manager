import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 認証不要なパス
const PUBLIC_PATHS = ['/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 公開パスはスルー
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // セッションチェック（cookieに保存したアクセストークン）
  const token = request.cookies.get('voz_access_token')?.value

  if (!token) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  // _next/static, favicon等は除外
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon-.*\\.png).*)'],
}
