import { NextRequest, NextResponse } from "next/server"
import { demoUser } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  const hasSession = request.cookies.has("skymap_session")
  if (!hasSession) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 })
  }
  return NextResponse.json(demoUser)
}
