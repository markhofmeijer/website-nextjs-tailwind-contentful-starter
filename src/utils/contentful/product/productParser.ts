import { Entry } from "contentful"

import mediaParser from "../media/mediaParser"
import seoParser from "../seo/seoParser"

import { IProductFields } from "@/types/contentful"
import { IProduct } from "@/types/product"
import { IMediaImage } from "@/types/media"

export default function productParser({ sys, fields }: Entry<IProductFields>): IProduct {
  const atmosphericImages: IMediaImage[] | undefined = fields.atmosphericImages?.map(
    img => mediaParser(img) as IMediaImage
  )

  return {
    id: sys.id,
    name: fields.name,
    slug: fields.slug,
    homepage: fields.homepage,
    description: fields.description ?? null,
    mainImage: fields.mainImage ? (mediaParser(fields.mainImage) as IMediaImage) : null,
    atmosphericImages: atmosphericImages ?? null,
    seo: seoParser(fields),
    updatedAt: sys.updatedAt,
  }
}
