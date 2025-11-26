import { richTextFromMarkdown } from "@contentful/rich-text-from-markdown"
import { documentToReactComponents, type Options } from "@contentful/rich-text-react-renderer"
import { INLINES, type Document } from "@contentful/rich-text-types"

import { IMarkdown } from "@/types/markdown"
import CustomLink from "./components/link"

const rendererOptions: Options = {
  renderNode: {
    [INLINES.HYPERLINK]: (node, children) => {
      const href = typeof node.data?.uri === "string" ? node.data.uri : ""
      return <CustomLink href={href}>{children}</CustomLink>
    },
  },
}

const isRichTextDocument = (value: unknown): value is Document => {
  if (!value || typeof value !== "object") return false
  return (value as Document).nodeType === "document"
}

const toDocument = (value: Document | string) => {
  if (isRichTextDocument(value)) return Promise.resolve(value)
  return richTextFromMarkdown(value)
}

const Markdown = async ({ src, label }: IMarkdown) => {
  if (!src) return null

  try {
    const document = await toDocument(src)
    return <>{documentToReactComponents(document, rendererOptions)}</>
  } catch (error) {
    const context = label ? ` for ${label}` : ""
    console.error(`Failed to render rich text${context}`, error)
    return typeof src === "string" ? <p className="whitespace-pre-wrap">{src}</p> : null
  }
}

export { Markdown }
