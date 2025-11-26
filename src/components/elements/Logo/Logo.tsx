import Image from "next/image"
import Link from "next/link"

type InternalHref = `/${string}`

interface PropTypes {
  link?: InternalHref
  alt?: string
}

const Logo = ({ link, alt = "logo" }: PropTypes) => {
  const logo = (
    <Image src="/logo.png" alt={alt} width={280} height={122} priority className="h-auto w-full max-w-xs" />
  )

  if (!link) {
    return logo
  }

  return (
    <Link href={link} aria-label="Ga naar de startpagina" className="inline-flex items-center">
      {logo}
    </Link>
  )
}

export { Logo }
