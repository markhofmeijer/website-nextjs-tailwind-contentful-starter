import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { draftMode } from "next/headers"
import { notFound } from "next/navigation"

import { Markdown } from "@/components/elements/Markdown"
import type { IPage } from "@/types/page"
import {
  getCachedProductBySlug,
  getCachedProductSlugs,
  getCachedSiteMetadata,
} from "@/app/_lib/data-loaders"
import { buildMetadata } from "@/app/_lib/seo"

export const revalidate = 300

type BackToProductsLinkProps = {
  variant: "overlay" | "inline"
}

const BackToProductsLink = ({ variant }: BackToProductsLinkProps) => {
  if (variant === "overlay") {
    return (
      <Link
        href="/products"
        className="inline-flex items-center rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-gray-900 shadow-md ring-1 ring-black/5 transition hover:bg-white"
      >
        &larr; Alle producten
      </Link>
    )
  }

  return (
    <Link
      href="/products"
      className="inline-flex items-center text-sm font-semibold text-orange-500 transition hover:text-orange-400"
    >
      &larr; Alle producten
    </Link>
  )
}

type PageParams = {
  slug: string
}

type PageProps = {
  params: PageParams | Promise<PageParams>
}

export async function generateStaticParams() {
  const products = await getCachedProductSlugs()
  return products
    .map(product => product.slug?.replace(/^\/+/, ""))
    .filter((slug): slug is string => Boolean(slug && slug.length))
    .map(slug => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params
    const slug = resolvedParams.slug
    const [siteMetadata, product] = await Promise.all([
      getCachedSiteMetadata(false),
      getCachedProductBySlug(slug, false).catch(() => null),
    ])

    if (!product) {
      return {}
    }

    const pageLike: IPage = {
      id: product.id,
      slug: product.slug,
      title: product.name,
      description: product.description,
      image: product.mainImage,
      seo: product.seo,
      updatedAt: product.updatedAt,
    }

    return buildMetadata({ siteMetadata, page: pageLike })
  } catch (_error) {
    return {}
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { isEnabled } = await draftMode()
  const resolvedParams = await params
  const slug = resolvedParams.slug
  const product = await getCachedProductBySlug(slug, isEnabled).catch(() => null)

  if (!product) {
    notFound()
  }

  return (
    <article className="space-y-10">
      <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
        {product.mainImage?.url ? (
          <div className="relative">
            <Image
              src={product.mainImage.url}
              alt={product.mainImage.description || product.mainImage.title || product.name}
              width={product.mainImage.dimensions.width}
              height={product.mainImage.dimensions.height}
              className="h-112 w-full object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
            />
            <div className="absolute left-6 top-6">
              <BackToProductsLink variant="overlay" />
            </div>
          </div>
        ) : null}

        <div className="space-y-6 p-8 text-gray-900">
          {!product.mainImage?.url ? <BackToProductsLink variant="inline" /> : null}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">Product</p>
            <h1 className="mt-2 text-4xl font-bold">{product.name}</h1>
            <p className="mt-2 text-sm text-gray-500">
              Bijgewerkt op {new Date(product.updatedAt).toLocaleDateString("nl-NL")}
            </p>
          </div>
          {product.description ? (
            <div className="space-y-6 text-gray-700">
              <Markdown src={product.description} label={`product:${product.slug}`} />
            </div>
          ) : (
            <p className="text-gray-500">Dit product heeft nog geen beschrijving.</p>
          )}

          {product.atmosphericImages?.length ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Sfeerbeelden</h2>
              <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {product.atmosphericImages.map(image => {
                  if (!image?.url) return null
                  const alt = image.description || image.title || product.name
                  return (
                    <li
                      key={image.id}
                      className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50"
                    >
                      <Image
                        src={image.url}
                        alt={alt}
                        width={image.dimensions.width}
                        height={image.dimensions.height}
                        className="h-72 w-full object-cover"
                        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                      />
                      {image.description ? (
                        <p className="px-4 py-3 text-sm text-gray-600">{image.description}</p>
                      ) : null}
                    </li>
                  )
                })}
              </ul>
            </div>
          ) : null}
        </div>
      </section>
    </article>
  )
}
