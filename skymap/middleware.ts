import { NextRequest, NextResponse } from "next/server"

// TODO(backend): the backend's /api/auth/login and /api/auth/signup routes should
// set an httpOnly `skymap_session` cookie on success. This middleware only checks
// for its presence — it does not verify/decode it (that's a backend concern).

export function middleware(request: NextRequest) {
  const hasSession = request.cookies.has("skymap_session")

  if (!hasSession) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
