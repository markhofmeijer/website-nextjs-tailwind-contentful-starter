import React, { useState, useEffect } from "react"
import { remark } from "remark"
import remarkBreaks from "remark-breaks"
import remarkGfm from "remark-gfm"
import remarkRehype from "remark-rehype"
import rehypeReact from "rehype-react"

import { IMarkdown } from "@/types/markdown"
import CustomLink from "./components/link"

const processor = remark()
  .use(remarkBreaks)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeReact, {
    createElement: React.createElement,
    components: {
      a: (props: any) => <CustomLink {...props} />,
    },
  })

const Markdown: React.FC<IMarkdown> = ({ src }) => {
  return src ? processor.processSync(src).result : null
}

export { Markdown }
