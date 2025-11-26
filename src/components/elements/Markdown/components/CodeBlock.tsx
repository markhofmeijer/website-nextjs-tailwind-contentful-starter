"use client"

interface CodeBlockProps {
  code: string
}

const baseClassName = [
  "my-6 overflow-x-auto rounded-2xl border p-5 text-sm shadow-lg transition-colors",
  "border-gray-200 bg-gray-50 text-gray-900 shadow-gray-200/40",
  "dark:border-slate-500 dark:bg-slate-700 dark:text-gray-50 dark:shadow-slate-800/30",
].join(" ")

const CodeBlock = ({ code }: CodeBlockProps) => {
  return (
    <pre className={baseClassName}>
      <code className="font-mono text-[0.95rem] leading-7 whitespace-pre-wrap wrap-break-word">
        {code}
      </code>
    </pre>
  )
}

export { CodeBlock }
