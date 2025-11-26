import getClient from "../contentful"
import pageParser from "./pageParser"

import type { IPageSkeleton, LOCALE_CODE } from "@/types/contentful"
import { IPage } from "@/types/page"

export default async function getPages(preview = false): Promise<IPage[]> {
  const entries = await getClient(preview).getEntries<IPageSkeleton, LOCALE_CODE>({
    content_type: "page",
  })

  return entries.items.map(pageParser)
}
