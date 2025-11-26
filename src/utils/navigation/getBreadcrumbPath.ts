import { INavigationItem } from "@/types/navigation"

const normalizeSlug = (slug: string | null | undefined) => {
  if (!slug) return null
  if (slug === "/" || slug === "home") return "/"
  return slug.startsWith("/") ? slug : `/${slug}`
}

const findPath = (
  items: INavigationItem[] | undefined,
  targetSlug: string,
): INavigationItem[] | null => {
  if (!items || !items.length) {
    return null
  }

  for (const item of items) {
    const currentSlug = normalizeSlug(item.slug)
    if (currentSlug === targetSlug) {
      return [item]
    }

    const childPath = findPath(item.subItems, targetSlug)
    if (childPath) {
      return [item, ...childPath]
    }
  }

  return null
}

export const getBreadcrumbPath = (
  items: INavigationItem[],
  slug: string | null | undefined,
  fallbackLabel = "/",
) => {
  const normalizedSlug = normalizeSlug(slug)
  if (!normalizedSlug) {
    return fallbackLabel
  }

  const path = findPath(items, normalizedSlug)
  if (!path || !path.length) {
    return fallbackLabel
  }

  if (path.length === 1) {
    return path[0].name ?? fallbackLabel
  }

  return path.map(item => item.name ?? "Pagina").join(" / ")
}
