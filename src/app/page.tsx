import type { Metadata } from "next"
import { draftMode } from "next/headers"
import { notFound } from "next/navigation"

import { Markdown } from "@/components/elements/Markdown"
import { getBreadcrumbPath } from "@/utils/navigation/getBreadcrumbPath"
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
  } catch (error) {
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

  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
          {breadcrumbPath}
        </p>
        <h1 className="mt-2 text-4xl font-bold text-gray-900">{page.title}</h1>
        {page.description ? (
          <div className="mt-6 prose max-w-none text-gray-700">
            <Markdown src={page.description} label={`page:${page.slug}`} />
          </div>
        ) : (
          <p className="mt-6 text-gray-600">Deze pagina heeft nog geen beschrijving.</p>
        )}
      </section>

      {products?.length ? (
        <section className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
              Producten
            </p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              Uitgelichte producten
            </h2>
          </div>
          <ul className="grid gap-6 md:grid-cols-2">
            {products.map(product => (
              <li
                key={product.id}
                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  {new Date(product.updatedAt).toLocaleDateString("nl-NL")}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-gray-900">{product.name}</h3>
                {product.description ? (
                  <div className="mt-4 text-gray-600">
                    <Markdown src={product.description} label={`product:${product.slug}`} />
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
