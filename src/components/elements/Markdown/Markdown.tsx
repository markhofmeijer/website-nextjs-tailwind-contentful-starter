import { richTextFromMarkdown, type FallbackResolver } from "@contentful/rich-text-from-markdown"
import { documentToReactComponents, type Options } from "@contentful/rich-text-react-renderer"
import { BLOCKS, INLINES, MARKS, type Document } from "@contentful/rich-text-types"
import type { ReactNode } from "react"

import { IMarkdown } from "@/types/markdown"
import CustomLink from "./components/link"
import { CodeBlock } from "./components/CodeBlock"

const rendererOptions: Options = {
  renderNode: {
    [INLINES.HYPERLINK]: (node, children) => {
      const href = typeof node.data?.uri === "string" ? node.data.uri : ""
      return <CustomLink href={href}>{children}</CustomLink>
    },
    [BLOCKS.QUOTE]: (_node, children) => (
      <blockquote className="my-6 border-l-4 border-slate-300 pl-4 italic transition-colors dark:border-slate-600">
        {children}
      </blockquote>
    ),
    [BLOCKS.UL_LIST]: (_node, children) => (
      <ul className="my-4 list-disc space-y-2 pl-6 transition-colors">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (_node, children) => (
      <ol className="my-4 list-decimal space-y-2 pl-6 transition-colors">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (_node, children) => (
      <li className="leading-relaxed transition-colors">{children}</li>
    ),
    [BLOCKS.PARAGRAPH]: (node, children) => {
      const isCodeBlock = node.content?.every(child => {
        if (child.nodeType !== "text") return false
        return child.marks?.some(mark => mark.type === MARKS.CODE)
      })

      if (isCodeBlock) {
        const codeText =
          node.content?.map(child => (child.nodeType === "text" ? child.value : "")).join("") ?? ""
        return <CodeBlock code={codeText} />
      }

      return <p className="my-4 leading-relaxed text-base text-current">{children}</p>
    },
  },
  renderText: text =>
    text.split(/\n/g).reduce<ReactNode[]>((acc, segment, index, array) => {
      acc.push(segment)
      if (index < array.length - 1) {
        acc.push(<br key={`br-${index}`} />)
      }
      return acc
    }, []),
}

const isRichTextDocument = (value: unknown): value is Document => {
  if (!value || typeof value !== "object") return false
  return (value as Document).nodeType === "document"
}

const fallbackResolver: FallbackResolver = async mdNode => {
  if (mdNode.type === "code") {
    const extendedNode = mdNode as typeof mdNode & { lang?: string }
    const language = typeof extendedNode.lang === "string" ? extendedNode.lang : null
    return {
      nodeType: BLOCKS.PARAGRAPH,
      data: {
        language,
      },
      content: [
        {
          nodeType: "text",
          value: typeof mdNode.value === "string" ? mdNode.value : "",
          marks: [{ type: MARKS.CODE }],
          data: {},
        },
      ],
    }
  }

  return null
}

const toDocument = (value: Document | string) => {
  if (isRichTextDocument(value)) return Promise.resolve(value)
  return richTextFromMarkdown(value, fallbackResolver)
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
