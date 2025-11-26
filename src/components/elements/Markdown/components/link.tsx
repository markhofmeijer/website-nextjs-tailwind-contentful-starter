import Link from "next/link"
import type { Route } from "next"
import type { ReactNode } from "react"

interface CustomLinkProps {
  children?: ReactNode
  href: string
}

export default function CustomLink({ children, href }: CustomLinkProps) {
  if (href.startsWith("/") || href === "") {
    const internalHref = (href === "" ? "/" : href) as Route
    return (
      <Link href={internalHref} className="underline hover:text-gray-900">
        {children}
      </Link>
    )
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" className="underline hover:text-gray-900">
      {children}
    </a>
  )
}
