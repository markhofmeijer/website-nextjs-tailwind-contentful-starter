import React from "react"
import Link from "next/link"

export default function CustomLink({
  children,
  href,
}: {
  children?: React.ReactNode
  href: string
}): React.ReactElement {
  return href.startsWith("/") || href === "" ? (
    <Link href={href}>
      <a>{children}</a>
    </Link>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
}
