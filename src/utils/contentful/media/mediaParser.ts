import { Asset } from "contentful"

import { IMediaItem, IMediaImage } from "@/types/media"

export default function mediaParser({ sys, fields }: Asset): IMediaItem {
  const mediaItem: IMediaItem = {
    id: sys.id,
    title: fields.title,
    fileName: fields.file.fileName,
    url: `https:${fields.file.url}`,
    mimeType: fields.file.contentType,
    description: fields.description ?? null,
    updatedAt: sys.updatedAt,
  }

  switch (fields.file.contentType) {
    case "image/apng":
    case "image/avif":
    case "image/gif":
    case "image/jpeg":
    case "image/png":
    case "image/svg+xml":
    case "image/webp":
      const imageWidth = fields.file.details.image ? fields.file.details.image.width : 0
      const imageHeight = fields.file.details.image ? fields.file.details.image.height : 0
      return {
        ...mediaItem,
        dimensions: {
          width: imageWidth,
          height: imageHeight,
          aspectRatio: imageWidth / imageHeight,
          orientation:
            imageWidth / imageHeight > 1
              ? "LANDSCAPE"
              : imageWidth / imageHeight < 1
              ? "PORTRAIT"
              : "SQUARE",
        },
      } as IMediaImage
    default:
      return mediaItem
  }
}
