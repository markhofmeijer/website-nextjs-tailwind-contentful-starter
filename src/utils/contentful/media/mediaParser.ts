import type { Asset, AssetFile, UnresolvedLink } from "contentful"

import { IMediaItem, IMediaImage } from "@/types/media"

type AssetFileField = Asset["fields"]["file"]

const isAssetFile = (file: AssetFileField): file is AssetFile => {
  return Boolean(file && typeof file === "object" && "url" in file)
}

export const isResolvedAsset = (
  asset?: Asset | UnresolvedLink<"Asset"> | null
): asset is Asset => asset?.sys?.type === "Asset"

export default function mediaParser({ sys, fields }: Asset): IMediaItem {
  if (!isAssetFile(fields.file)) {
    throw new Error(`Asset ${sys.id} is missing required file data`)
  }

  const file = fields.file
  const contentType = file.contentType ?? "application/octet-stream"

  const fileName: string =
    typeof file.fileName === "string" && file.fileName.length > 0
      ? file.fileName
      : `${sys.id}.asset`
  const fileUrl: string = typeof file.url === "string" ? file.url : ""
  const mediaTitle: string = typeof fields.title === "string" ? fields.title : fileName

  const mediaItem: IMediaItem = {
    id: sys.id,
    title: mediaTitle,
    fileName,
    url: fileUrl.length > 0 ? `https:${fileUrl}` : undefined,
    mimeType: contentType,
    description: typeof fields.description === "string" ? fields.description : null,
    updatedAt: sys.updatedAt,
  }

  switch (contentType) {
    case "image/apng":
    case "image/avif":
    case "image/gif":
    case "image/jpeg":
    case "image/png":
    case "image/svg+xml":
    case "image/webp":
      const imageWidth = file.details.image ? file.details.image.width : 0
      const imageHeight = file.details.image ? file.details.image.height : 0
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
