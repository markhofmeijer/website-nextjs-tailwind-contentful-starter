import Image from "next/image"
import Link from "next/link"

type InternalHref = `/${string}`

interface PropTypes {
  link?: InternalHref
  alt?: string
}

const Logo = ({ link, alt = "logo placeholder" }: PropTypes) => {
  const logo = (
    <div className="flex items-center">
      <Image
        src="/logo-dark.svg"
        alt={alt}
        width={180}
        height={40}
        priority
        className="h-8 w-auto dark:hidden"
        sizes="(min-width: 1024px) 180px, 140px"
      />
      <Image
        src="/logo-light.svg"
        alt={alt}
        width={180}
        height={40}
        priority
        className="hidden h-8 w-auto dark:block"
        sizes="(min-width: 1024px) 180px, 140px"
      />
    </div>
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
