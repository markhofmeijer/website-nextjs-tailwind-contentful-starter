import mediaParser, { isResolvedAsset } from "../media/mediaParser"

import { ISiteMetadataEntry, IPageEntry, IProductEntry } from "@/types/contentful"
import { IMediaImage } from "@/types/media"
import { ISEO } from "@/types/seo"

type SEOFieldSource =
  | ISiteMetadataEntry["fields"]
  | IPageEntry["fields"]
  | IProductEntry["fields"]

export default function seoParser(fields: SEOFieldSource): ISEO {
  const image = isResolvedAsset(fields.seo_image)
    ? (mediaParser(fields.seo_image) as IMediaImage)
    : null

  return {
    title: fields.seo_title ?? null,
    description: fields.seo_description ?? null,
    url: fields.seo_url ?? null,
    image,
    keywords: fields.seo_keywords ?? [],
  }
}
