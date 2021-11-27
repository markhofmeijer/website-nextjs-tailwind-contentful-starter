import { EntryCollection } from "contentful"

import getClient from "../contentful"
import productParser from "./productParser"

import { IProductFields } from "@/types/contentful"
import { IProduct } from "@/types/product"

export default async function getProductSlugs(
  preview = false,
  reverse = false
): Promise<IProduct[]> {
  const entries: EntryCollection<IProductFields> = await getClient(preview).getEntries({
    content_type: "product",
    order: reverse ? "-sys.createdAt" : "sys.createdAt",
    select: "fields.slug",
  })

  return entries.items.map(productParser)
}
