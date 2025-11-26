import type { Metadata } from "next/dist/types"

import type { IMetadata } from "@/types/metadata"
import type { IPage } from "@/types/page"
import type { IMediaImage } from "@/types/media"

interface BuildMetadataParams {
  siteMetadata: IMetadata
  page?: IPage | null
}

const buildKeywords = (siteKeywords?: string[] | null, pageKeywords?: string[] | null) => {
  const combined = [siteKeywords ?? [], pageKeywords ?? []].flat().filter(Boolean) as string[]
  return combined.length ? Array.from(new Set(combined)) : undefined
}

const buildImage = (image?: IMediaImage | null) => {
  if (!image?.url) return undefined
  return [
    {
      url: image.url,
      width: image.dimensions?.width,
      height: image.dimensions?.height,
      alt: image.title,
    },
  ]
}

export const buildMetadata = ({ siteMetadata, page }: BuildMetadataParams): Metadata => {
  const siteSeo = siteMetadata.seo ?? {}
  const pageSeo = page?.seo ?? {}

  const title = pageSeo.title ?? siteSeo.title ?? siteMetadata.clientName ?? "Website"
  const description =
    pageSeo.description ?? siteSeo.description ?? "Bekijk de meest recente Contentful pagina."
  const canonicalUrl = pageSeo.url ?? siteSeo.url
  const metadataBase = (() => {
    const url = canonicalUrl ?? siteSeo.url
    return url ? new URL(url) : undefined
  })()
  const keywords = buildKeywords(siteSeo.keywords, pageSeo.keywords)
  const ogImages = buildImage(pageSeo.image ?? siteSeo.image ?? null)
  const openGraphUrl = canonicalUrl ?? siteSeo.url ?? undefined

  return {
    title,
    description,
    metadataBase,
    alternates: canonicalUrl
      ? {
          canonical: canonicalUrl,
        }
      : undefined,
    keywords,
    openGraph: {
      title,
      description,
      url: openGraphUrl,
      siteName: siteMetadata.clientName,
      images: ogImages,
      type: "website",
      locale: page?.locale ?? undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages?.map(image => image.url),
    },
  }
}
