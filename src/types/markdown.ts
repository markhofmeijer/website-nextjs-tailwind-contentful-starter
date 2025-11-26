import type { Document } from "@contentful/rich-text-types"

export interface IMarkdown {
  src: Document | string | null | undefined
  label?: string
}
