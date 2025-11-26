import getClient from "../contentful"
import navigationItemParser from "./navigationItemParser"

import type { ISiteNavigationSkeleton, LOCALE_CODE } from "@/types/contentful"
import { INavigationItem } from "@/types/navigation"

type IncludeDepth = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export default async function getSiteNavigationItems(
  preview = false,
  levels = 5,
  code = "root",
): Promise<INavigationItem[]> {
  if (levels < 2)
    throw new Error(
      "Specified navigation item level cannot be less than 2 due to required linked page objects",
    )

  const includeDepth = Math.min(levels, 10) as IncludeDepth

  const entries = await getClient(preview).getEntries<ISiteNavigationSkeleton, LOCALE_CODE>({
    content_type: "siteNavigation",
    include: includeDepth,
    "fields.code": code,
  })

  const root = entries.items.map(navigationItemParser)

  return root.length > 0 ? root[0].subItems : []
}
