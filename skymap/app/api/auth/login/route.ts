import { NextRequest, NextResponse } from "next/server"
import { demoUser } from "@/lib/mock-data"

// DEMO ONLY — accepts any email/password and logs the user in as the demo
// buyer. Replace with real credential verification against your database.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  if (!body?.email || !body?.password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 })
  }

  const res = NextResponse.json({ user: demoUser, token: "demo-token" })
  res.cookies.set("skymap_session", "demo-token", {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  })
  return res
}
