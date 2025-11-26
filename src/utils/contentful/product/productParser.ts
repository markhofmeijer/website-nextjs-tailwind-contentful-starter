import mediaParser, { isResolvedAsset } from "../media/mediaParser"
import seoParser from "../seo/seoParser"

import { IProductEntry } from "@/types/contentful"
import { IProduct } from "@/types/product"
import { IMediaImage } from "@/types/media"

export default function productParser({ sys, fields }: IProductEntry): IProduct {
  const atmosphericImages: IMediaImage[] | undefined = fields.atmosphericImages
    ?.map(asset => (isResolvedAsset(asset) ? (mediaParser(asset) as IMediaImage) : null))
    .filter((image): image is IMediaImage => Boolean(image))

  return {
    id: sys.id,
    name: fields.name,
    slug: fields.slug,
    homepage: fields.homepage,
    description: fields.description ?? null,
    mainImage: isResolvedAsset(fields.mainImage)
      ? (mediaParser(fields.mainImage) as IMediaImage)
      : null,
    atmosphericImages: atmosphericImages ?? null,
    seo: seoParser(fields),
    updatedAt: sys.updatedAt,
  }
}
