import { Entry } from "contentful"

import mediaParser from "../media/mediaParser"
import seoParser from "../seo/seoParser"

import { IPageFields } from "@/types/contentful"
import { IPage } from "@/types/page"
import { IMediaImage } from "@/types/media"

export default function pageParser({ sys, fields }: Entry<IPageFields>): IPage {
  let language, locale
  switch (sys.locale) {
    case "nl":
      language = "nl"
      locale = "nl_NL"
      break
    default:
      language = "en"
      locale = "en_US"
  }
  //sys.updatedAt
  return {
    id: sys.id,
    slug: fields.slug === "home" ? "/" : fields.slug,
    title: fields.title,
    image: fields.image ? (mediaParser(fields.image) as IMediaImage) : null,
    description: fields.description ?? null,
    language,
    locale,
    seo: seoParser(fields),
    updatedAt: sys.updatedAt,
  }
}
