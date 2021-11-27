import { IMediaImage } from "./media"
import { ISEO } from "./seo"

export interface IPage {
  id: string
  slug: string
  title: string
  image?: IMediaImage | null
  description?: string | null
  language?: string | null
  locale?: string | null
  seo: ISEO
  updatedAt: string
}
