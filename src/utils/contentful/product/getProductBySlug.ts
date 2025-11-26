import getClient from "../contentful"
import productParser from "./productParser"

import type { IProductSkeleton, LOCALE_CODE } from "@/types/contentful"
import { IProduct } from "@/types/product"

export default async function getProductBySlug(
  slug: string | string[],
  preview = false
): Promise<IProduct> {
  if (Array.isArray(slug)) slug = slug[0]

  const entries = await getClient(preview).getEntries<IProductSkeleton, LOCALE_CODE>({
    content_type: "product",
    "fields.slug": slug,
  })

  if (entries.items.length === 0) throw new Error(`Required product with slug ${slug} not found`)

  return productParser(entries.items[0])
}
