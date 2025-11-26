import type { Metadata } from "next"
import { draftMode } from "next/headers"
import { notFound } from "next/navigation"

import { Markdown } from "@/components/elements/Markdown"
import {
  getCachedPageBySlug,
  getCachedPageSlugs,
  getCachedSiteMetadata,
} from "../_lib/data-loaders"
import { buildMetadata } from "../_lib/seo"

export const revalidate = 300

type PageProps = {
  params: {
    slug: string[]
  }
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
    const slug = toSlug(params.slug)
    const [siteMetadata, page] = await Promise.all([
      getCachedSiteMetadata(false),
      getCachedPageBySlug(slug, false).catch(() => null),
    ])

    return buildMetadata({ siteMetadata, page })
  } catch (error) {
    return {}
  }
}

export default async function Page({ params }: PageProps) {
  const { isEnabled } = await draftMode()
  const slug = toSlug(params.slug)
  const page = await getCachedPageBySlug(slug, isEnabled).catch(() => null)

  if (!page) {
    notFound()
  }

  return (
    <article className="rounded-3xl bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
        {page.language}
      </p>
      <h1 className="mt-2 text-4xl font-bold text-gray-900">{page.title}</h1>
      {page.description ? (
        <div className="mt-6 prose max-w-none text-gray-700">
          <Markdown src={page.description} label={`page:${page.slug}`} />
        </div>
      ) : (
        <p className="mt-6 text-gray-600">Deze pagina heeft nog geen content.</p>
      )}
    </article>
  )
}
