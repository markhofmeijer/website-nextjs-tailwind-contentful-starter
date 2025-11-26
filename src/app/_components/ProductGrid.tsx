import Image from "next/image"
import Link from "next/link"

import { Markdown } from "@/components/elements/Markdown"
import type { IProduct } from "@/types/product"

interface ProductGridProps {
  products: IProduct[]
  eyebrow?: string | null
  heading?: string | null
  columnClassName?: string
}

const ProductGrid = ({
  products,
  eyebrow = "Producten",
  heading = "Uitgelichte producten",
  columnClassName = "md:grid-cols-2",
}: ProductGridProps) => {
  if (!products.length) {
    return null
  }

  return (
    <section className="space-y-6">
      {eyebrow || heading ? (
        <div>
          {eyebrow ? (
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
              {eyebrow}
            </p>
          ) : null}
          {heading ? (
            <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{heading}</h2>
          ) : null}
        </div>
      ) : null}

      <ul className={`grid gap-6 ${columnClassName}`}>
        {products.map(product => {
          const mainImage = product.mainImage
          const imageAlt =
            mainImage?.description || mainImage?.title || `Afbeelding van ${product.name}`
          const cardBody = (
            <>
              {mainImage?.url ? (
                <div className="relative mb-4 overflow-hidden rounded-2xl bg-gray-50">
                  <Image
                    src={mainImage.url}
                    alt={imageAlt}
                    width={mainImage.dimensions.width}
                    height={mainImage.dimensions.height}
                    className="h-48 w-full object-cover"
                    sizes="(min-width: 768px) 50vw, 100vw"
                    priority={false}
                  />
                </div>
              ) : null}
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                {new Date(product.updatedAt).toLocaleDateString("nl-NL")}
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-gray-900">{product.name}</h3>
              {product.description ? (
                <div className="mt-4 text-gray-600">
                  <Markdown src={product.description} label={`product:${product.slug}`} />
                </div>
              ) : null}
            </>
          )

          return (
            <li key={product.id}>
              <div className="group relative h-full rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                {product.slug ? (
                  <Link
                    href={`/product/${product.slug}`}
                    className="absolute inset-0 z-10 rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
                    aria-label={`Bekijk ${product.name}`}
                  >
                    <span className="sr-only">Bekijk {product.name}</span>
                  </Link>
                ) : null}
                <div className="relative z-0">{cardBody}</div>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export { ProductGrid }
