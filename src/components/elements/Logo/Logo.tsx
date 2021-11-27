import React from "react"
import Image from "next/image"
import Link from "next/link"

interface PropTypes {
  link?: string
  alt?: string
}

const Logo: React.FC<PropTypes> = props => {
  const alt = props.alt ? props.alt : "logo"
  const logo = <Image src="/logo.png" alt={alt} width={280} height={122} />

  return props.link ? (
    <Link href={props.link}>
      <a>{logo}</a>
    </Link>
  ) : (
    logo
  )
}

export { Logo }
