import type { Document } from "@contentful/rich-text-types"
import { IMediaImage } from "./media"
import { ISEO } from "./seo"

export interface IPage {
  id: string
  slug: string
  title: string
  image?: IMediaImage | null
  description?: Document | null
  language?: string | null
  locale?: string | null
  seo: ISEO
  updatedAt: string
}
