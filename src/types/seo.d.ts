import { IMediaImage } from "./media"

export interface ISEO {
  title?: string | null
  description?: string | null
  url?: string | null
  author?: string | null
  image?: IMediaImage | null
  keywords?: string[] | null
}
