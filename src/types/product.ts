import { IMediaImage } from "./media"
import { ISEO } from "./seo"

export interface IProduct {
  id: string
  name: string
  slug: string
  homepage: boolean
  description?: string | null
  mainImage: IMediaImage | null
  atmosphericImages?: IMediaImage[] | null
  seo: ISEO
  updatedAt: string
}
