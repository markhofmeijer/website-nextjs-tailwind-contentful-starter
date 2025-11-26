import type { Metadata } from "next/dist/types"
import { draftMode } from "next/headers"
import { notFound } from "next/navigation"

import { getBreadcrumbPath } from "@/utils/navigation/getBreadcrumbPath"
import { HomePageContent } from "./_components/HomePageContent"
import {
  getCachedHomepageProducts,
  getCachedPageBySlug,
  getCachedSiteMetadata,
  getCachedSiteNavigation,
} from "./_lib/data-loaders"
import { buildMetadata } from "./_lib/seo"

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  try {
    const [siteMetadata, page] = await Promise.all([
      getCachedSiteMetadata(false),
      getCachedPageBySlug("/", false),
    ])

    return buildMetadata({ siteMetadata, page })
  } catch (_error) {
    return {}
  }
}

export default async function HomePage() {
  const { isEnabled } = await draftMode()
  const [page, products, navItems] = await Promise.all([
    getCachedPageBySlug("/", isEnabled).catch(() => null),
    getCachedHomepageProducts(isEnabled, true).catch(() => []),
    getCachedSiteNavigation(isEnabled).catch(() => []),
  ])

  if (!page) {
    notFound()
  }

  const breadcrumbPath = getBreadcrumbPath(navItems, page.slug ?? "/", page.title ?? "/")

  return <HomePageContent breadcrumbPath={breadcrumbPath} page={page} products={products ?? []} />
}
