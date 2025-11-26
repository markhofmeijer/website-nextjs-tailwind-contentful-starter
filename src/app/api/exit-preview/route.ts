import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { draftMode } from "next/headers"

export async function GET(request: NextRequest) {
  const draft = await draftMode()
  draft.disable()

  const redirectUrl = new URL("/", request.nextUrl.origin)
  const response = NextResponse.redirect(redirectUrl)
  response.headers.set("Cache-Control", "no-store")
  return response
}
