import { NextResponse } from "next/server"
import { demoProperties } from "@/lib/mock-data"

export async function GET() {
  return NextResponse.json(demoProperties.filter((p) => p.saved))
}
