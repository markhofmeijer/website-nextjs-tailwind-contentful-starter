import { EntryCollection } from "contentful"

import getClient from "../contentful"
import navigationItemParser from "./navigationItemParser"

import { ISiteNavigationFields } from "@/types/contentful"
import { INavigationItem } from "@/types/navigation"

export default async function getSiteNavigationItems(
  preview = false,
  levels = 2,
  code = "root"
): Promise<INavigationItem[]> {
  if (levels < 2)
    throw new Error(
      "Specified navigation item level cannot be less than 2 due to required linked page objects"
    )

  const entries: EntryCollection<ISiteNavigationFields> = await getClient(preview).getEntries({
    content_type: "siteNavigation",
    include: levels,
    "fields.code": code,
  })

  const root = entries.items.map(navigationItemParser)

  return root.length > 0 ? root[0].subItems : []
}
