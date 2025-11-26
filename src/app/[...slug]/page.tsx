import type { Metadata } from "next/dist/types"
import { draftMode } from "next/headers"
import { notFound } from "next/navigation"

import { getBreadcrumbPath } from "@/utils/navigation/getBreadcrumbPath"
import { DefaultPageSection } from "@/app/_components/DefaultPageSection"
import { ProductGrid } from "@/app/_components/ProductGrid"
import { ContactForm } from "@/app/_components/ContactForm"
import {
  getCachedPageBySlug,
  getCachedPageSlugs,
  getCachedProducts,
  getCachedSiteMetadata,
  getCachedSiteNavigation,
} from "../_lib/data-loaders"
import { buildMetadata } from "../_lib/seo"

export const revalidate = 300

type PageParams = {
  slug: string[]
}

type PageProps = {
  params: PageParams | Promise<PageParams>
}

const toSlug = (segments: string[] | undefined) => segments?.join("/") ?? ""

export async function generateStaticParams() {
  const pages = await getCachedPageSlugs()
  return pages
    .filter(page => page.slug && page.slug !== "/")
    .map(page => ({ slug: page.slug.replace(/^\//, "").split("/") }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params
    const slug = toSlug(resolvedParams.slug)
    const [siteMetadata, page] = await Promise.all([
      getCachedSiteMetadata(false),
      getCachedPageBySlug(slug, false).catch(() => null),
    ])

    return buildMetadata({ siteMetadata, page })
  } catch (_error) {
    return {}
  }
}

export default async function Page({ params }: PageProps) {
  const { isEnabled } = await draftMode()
  const resolvedParams = await params
  const slug = toSlug(resolvedParams.slug)
  const shouldLoadProducts = slug === "products"

  const [page, navItems, products] = await Promise.all([
    getCachedPageBySlug(slug, isEnabled).catch(() => null),
    getCachedSiteNavigation(isEnabled).catch(() => []),
    shouldLoadProducts ? getCachedProducts(isEnabled, true).catch(() => []) : Promise.resolve([]),
  ])

  if (!page) {
    notFound()
  }

  const breadcrumbPath = getBreadcrumbPath(navItems, page.slug ?? slug, page.title ?? "/")
  const isProductsPage = shouldLoadProducts || page.slug === "/products"
  const isContactPage = slug === "contact" || page.slug === "/contact"
  const pageSection = (
    <DefaultPageSection
      breadcrumbPath={breadcrumbPath}
      title={page.title}
      description={page.description}
      slug={page.slug ?? slug}
      emptyDescriptionMessage="Deze pagina heeft nog geen content."
    />
  )

  if (isProductsPage) {
    return (
      <div className="space-y-10">
        {pageSection}
        <ProductGrid
          products={products}
          eyebrow="Producten"
          heading="Alle producten"
          columnClassName="md:grid-cols-3"
        />
      </div>
    )
  }

  if (isContactPage) {
    return (
      <div className="space-y-10">
        {pageSection}
        <ContactForm />
      </div>
    )
  }

  return pageSection
}
