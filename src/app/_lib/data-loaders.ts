import { cache } from "react"

import getHomepageProducts from "@/utils/contentful/product/getHomepageProducts"
import getPageBySlug from "@/utils/contentful/page/getPageBySlug"
import getPageSlugs from "@/utils/contentful/page/getPageSlugs"
import getPages from "@/utils/contentful/page/getPages"
import getProductBySlug from "@/utils/contentful/product/getProductBySlug"
import getProductSlugs from "@/utils/contentful/product/getProductSlugs"
import getProducts from "@/utils/contentful/product/getProducts"
import getSiteMetadata from "@/utils/contentful/siteMetadata/getSiteMetadata"
import getSiteNavigationItems from "@/utils/contentful/siteNavigation/getSiteNavigationItems"

export const getCachedSiteMetadata = cache(async (preview: boolean) => {
  return getSiteMetadata(preview)
})

export const getCachedSiteNavigation = cache(async (preview: boolean) => {
  return getSiteNavigationItems(preview)
})

export const getCachedPageBySlug = cache(async (slug: string, preview: boolean) => {
  return getPageBySlug(slug, preview)
})

export const getCachedHomepageProducts = cache(async (preview: boolean, reverse = false) => {
  return getHomepageProducts(preview, reverse)
})

export const getCachedProducts = cache(async (preview: boolean, reverse = false) => {
  return getProducts(preview, reverse)
})

export const getCachedProductBySlug = cache(async (slug: string, preview: boolean) => {
  return getProductBySlug(slug, preview)
})

export const getCachedProductSlugs = cache(async () => {
  return getProductSlugs(false)
})

export const getCachedPageSlugs = cache(async () => {
  return getPageSlugs(false)
})

export const getCachedPages = cache(async () => {
  return getPages(false)
})
