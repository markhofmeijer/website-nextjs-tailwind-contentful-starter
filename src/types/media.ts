export interface IMediaItem {
  id: string
  title: string
  fileName: string
  url?: string | null
  mimeType: string
  description?: string | null
  updatedAt: string
}

export interface IMediaImage extends IMediaItem {
  dimensions: {
    width: number
    height: number
    aspectRatio: number
    orientation: "LANDSCAPE" | "PORTRAIT" | "SQUARE"
  }
}
