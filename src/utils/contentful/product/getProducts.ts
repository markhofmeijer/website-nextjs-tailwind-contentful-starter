import getClient from "../contentful"
import productParser from "./productParser"

import type { IProductSkeleton, LOCALE_CODE } from "@/types/contentful"
import { IProduct } from "@/types/product"

export default async function getProducts(preview = false, reverse = false): Promise<IProduct[]> {
  const entries = await getClient(preview).getEntries<IProductSkeleton, LOCALE_CODE>({
    content_type: "product",
    order: [reverse ? "-sys.createdAt" : "sys.createdAt"],
  })

  return entries.items.map(productParser)
}
