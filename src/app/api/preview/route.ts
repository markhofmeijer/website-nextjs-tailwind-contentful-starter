import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { draftMode } from "next/headers"

import getClient from "@/utils/contentful/contentful"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get("secret")
  const entryId = searchParams.get("id")
  const slug = searchParams.get("slug")

  if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET || !slug || !entryId) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 })
  }

  try {
    await getClient(true).getEntry(entryId)
  } catch (error) {
    return NextResponse.json({ message: "Invalid metadata" }, { status: 401 })
  }

  const draft = await draftMode()
  draft.enable()

  const pathname = slug === "/home" ? "/" : slug
  const redirectUrl = new URL(pathname, request.nextUrl.origin)

  const response = NextResponse.redirect(redirectUrl)
  response.headers.set("Cache-Control", "no-store")
  return response
}
