import { Entry } from "contentful"

import { ISiteNavigationFields } from "@/types/contentful"
import { INavigationItem } from "@/types/navigation"

export default function navigationItemParser({
  sys,
  fields,
}: Entry<ISiteNavigationFields>): INavigationItem {
  const slug = fields.page && fields.page.sys.type !== "Link" ? fields.page.fields.slug : null

  const subItems = fields.subNavItems
    ?.filter(item => item.sys.type !== "Link")
    .map(navigationItemParser)

  return {
    id: sys.id,
    name: fields.name,
    code: fields.code ?? null,
    slug,
    subItems: subItems ?? [],
    updatedAt: sys.updatedAt,
  }
}
