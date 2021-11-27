import { EntryCollection } from "contentful"

import getClient from "../contentful"
import pageParser from "./pageParser"

import { IPageFields } from "@/types/contentful"
import { IPage } from "@/types/page"

export default async function getPageBySlug(
  slug: string | string[],
  preview = false
): Promise<IPage> {
  if (Array.isArray(slug)) slug = slug[0]

  const entries: EntryCollection<IPageFields> = await getClient(preview).getEntries({
    content_type: "page",
    "fields.slug": slug === "/" ? "home" : slug,
  })

  if (entries.items.length === 0) throw new Error(`Required page with slug ${slug} not found`)

  return pageParser(entries.items[0])
}
