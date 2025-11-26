import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import getPages from "@/utils/contentful/page/getPages"

const formatSitemapRecord = (url: string, updatedAt: string) =>
  `<url><loc>${url}</loc><lastmod>${updatedAt}</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url>`

export async function GET(request: NextRequest) {
  const baseUrl = (process.env.BASE_URL ?? request.nextUrl.origin).replace(/\/$/, "")
  const pages = await getPages(false)

  const pageEntries = pages
    .map(page => {
      const slugPath = page.slug === "/" ? "" : (page.slug?.replace(/^\//, "") ?? "")
      const url = page.seo.url ?? `${baseUrl}${slugPath ? `/${slugPath}` : ""}`
      return formatSitemapRecord(url, page.updatedAt)
    })
    .join("")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pageEntries}</urlset>`

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  })
}
