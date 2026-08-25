import { NextRequest, NextResponse } from "next/server"

// TODO(backend): the backend's /api/auth/login and /api/auth/signup routes should
// set an httpOnly `skymap_session` cookie on success. This demo cookie carries a
// plain role prefix so middleware can mirror buyer vs owner routing locally.

export function middleware(request: NextRequest) {
  const session = request.cookies.get("skymap_session")?.value
  const pathname = request.nextUrl.pathname
  const ownerRoute = pathname.startsWith("/owner")
  const ownerAuthRoute = pathname === "/owner/login" || pathname === "/owner/signup"

  if (ownerAuthRoute) {
    return NextResponse.next()
  }

  if (!session) {
    const loginUrl = new URL(ownerRoute ? "/owner/login" : "/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  const role = session.startsWith("owner-") ? "owner" : "buyer"
  if (ownerRoute && role !== "owner") {
    return NextResponse.redirect(new URL("/owner/login", request.url))
  }
  if (pathname.startsWith("/dashboard") && role !== "buyer") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/owner/:path*"],
}
