import type { UnresolvedLink } from "contentful"

import { IPageEntry, ISiteNavigationEntry } from "@/types/contentful"
import { INavigationItem } from "@/types/navigation"

const isResolvedEntry = <T extends { sys: { type: string } }>(
  entry?: T | UnresolvedLink<"Entry">
): entry is T => Boolean(entry && entry.sys.type !== "Link")

export default function navigationItemParser({
  sys,
  fields,
}: ISiteNavigationEntry): INavigationItem {
  const pageEntry: IPageEntry | null = isResolvedEntry<IPageEntry>(fields.page)
    ? fields.page
    : null
  const slug = pageEntry ? pageEntry.fields.slug : null

  const subItems = fields.subNavItems
    ?.filter((item): item is ISiteNavigationEntry => isResolvedEntry(item))
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
