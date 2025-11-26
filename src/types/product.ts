import type { Document } from "@contentful/rich-text-types"
import { IMediaImage } from "./media"
import { ISEO } from "./seo"

export interface IProduct {
  id: string
  name: string
  slug: string
  homepage: boolean
  description?: Document | null
  mainImage: IMediaImage | null
  atmosphericImages?: IMediaImage[] | null
  seo: ISEO
  updatedAt: string
}
