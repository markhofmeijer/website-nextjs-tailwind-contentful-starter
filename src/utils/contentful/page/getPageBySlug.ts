import getClient from "../contentful"
import pageParser from "./pageParser"

import type { IPageSkeleton, LOCALE_CODE } from "@/types/contentful"
import { IPage } from "@/types/page"

export default async function getPageBySlug(
  slug: string | string[],
  preview = false
): Promise<IPage> {
  if (Array.isArray(slug)) slug = slug[0]

  const entries = await getClient(preview).getEntries<IPageSkeleton, LOCALE_CODE>({
    content_type: "page",
    "fields.slug": slug === "/" ? "home" : slug,
  })

  if (entries.items.length === 0) throw new Error(`Required page with slug ${slug} not found`)

  return pageParser(entries.items[0])
}
