import { richTextFromMarkdown, type FallbackResolver } from "@contentful/rich-text-from-markdown"
import { documentToReactComponents, type Options } from "@contentful/rich-text-react-renderer"
import { BLOCKS, INLINES, MARKS, type Document } from "@contentful/rich-text-types"
import { Children, Fragment, type ReactNode } from "react"

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
    [BLOCKS.TABLE]: (node, children) => {
      type TableRowNode = (typeof node.content)[number] & {
        content?: Array<{
          nodeType: BLOCKS
          content?: Array<{ nodeType: string; value?: string }>
        }>
      }

      const rows = (node.content ?? []) as TableRowNode[]
      const childArray = Children.toArray(children)

      const isSeparatorRow = (row: TableRowNode) => {
        if (!row.content?.length) return false
        return row.content.every(cell => {
          const cellText = (cell.content ?? [])
            .map(child => ("value" in child && typeof child.value === "string" ? child.value : ""))
            .join("")
            .trim()
          return /^:?-{3,}:?$/.test(cellText)
        })
      }

      const rowEntries = rows
        .map((row, index) => ({
          row,
          node: childArray[index],
        }))
        .filter(entry => entry.node !== undefined && !isSeparatorRow(entry.row))

      if (!rowEntries.length) {
        return (
          <div className="my-6 overflow-x-auto rounded-3xl border border-gray-200 shadow-sm dark:border-slate-700">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm dark:divide-slate-700" />
          </div>
        )
      }

      const hasHeaderCells = (row: TableRowNode) =>
        row.content?.some(cell => cell.nodeType === BLOCKS.TABLE_HEADER_CELL) ?? false

      let headerEntries = rowEntries.filter(entry => hasHeaderCells(entry.row))
      if (!headerEntries.length) {
        headerEntries = [rowEntries[0]]
      }

      const headerSet = new Set(headerEntries)
      const bodyEntries = rowEntries.filter(entry => !headerSet.has(entry))

      return (
        <div className="my-6 overflow-x-auto rounded-3xl border border-gray-200 shadow-sm dark:border-slate-700">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm dark:divide-slate-700">
            {headerEntries.length ? (
              <thead className="divide-y divide-slate-200 bg-slate-100 dark:divide-slate-600 dark:bg-slate-700 [&>tr]:bg-transparent [&>tr]:dark:bg-transparent">
                {headerEntries.map((entry, index) => (
                  <Fragment key={`table-head-row-${index}`}>{entry.node}</Fragment>
                ))}
              </thead>
            ) : null}
            {bodyEntries.length ? (
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800 [&>tr]:bg-white [&>tr:nth-child(odd)]:bg-gray-50 dark:[&>tr]:bg-slate-900 dark:[&>tr:nth-child(odd)]:bg-slate-800">
                {bodyEntries.map((entry, index) => (
                  <Fragment key={`table-body-row-${index}`}>{entry.node}</Fragment>
                ))}
              </tbody>
            ) : null}
          </table>
        </div>
      )
    },
    [BLOCKS.TABLE_ROW]: (_node, children) => <tr>{children}</tr>,
    [BLOCKS.TABLE_HEADER_CELL]: (_node, children) => (
      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
        {children}
      </th>
    ),
    [BLOCKS.TABLE_CELL]: (_node, children) => (
      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-100">{children}</td>
    ),
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
