import { IMetadata } from "@/types/metadata"
import { ThemeSwitcher } from "@/components/elements/ThemeSwitcher"

interface FooterProps {
  metaData?: IMetadata
}

const Footer = ({ metaData }: FooterProps) => {
  const currentYear = new Date().getFullYear()
  const addressLine = [metaData?.clientZipCode, metaData?.clientCity].filter(Boolean).join(" ")
  const socialLinks = [
    { href: metaData?.clientSocialMediaLinkedIn, label: "LinkedIn" },
    { href: metaData?.clientSocialMediaTwitter, label: "Twitter" },
    { href: metaData?.clientSocialMediaFacebook, label: "Facebook" },
    { href: metaData?.clientSocialMediaInstagram, label: "Instagram" },
    { href: metaData?.clientSocialMediaYouTube, label: "YouTube" },
  ].filter((link): link is { href: string; label: string } => Boolean(link.href))

  return (
    <footer className="border-t border-gray-200 bg-gray-50 transition-colors dark:border-slate-800 dark:bg-slate-950">
      <div className="container flex flex-col gap-8 py-8 text-sm text-gray-600 transition-colors dark:text-gray-300 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="text-base font-semibold text-gray-900 dark:text-gray-50">
            {metaData?.clientName}
          </p>
          {metaData?.clientAddress ? <p>{metaData.clientAddress}</p> : null}
          {addressLine ? <p>{addressLine}</p> : null}
          {metaData?.clientPhone ? <p>Tel: {metaData.clientPhone}</p> : null}
          {metaData?.clientEmail ? (
            <p>
              Email:{" "}
              <a
                href={`mailto:${metaData.clientEmail}`}
                className="underline decoration-dotted underline-offset-4 hover:text-gray-900 dark:hover:text-gray-100"
              >
                {metaData.clientEmail}
              </a>
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <p className="text-base font-semibold text-gray-900 dark:text-gray-50">Openingstijden</p>
          {metaData?.clientOpeningHours ? (
            <p>{metaData.clientOpeningHours}</p>
          ) : (
            <p>Neem contact op voor actuele tijden.</p>
          )}
          {metaData?.clientWebshop ? (
            <a
              href={metaData.clientWebshop}
              className="underline decoration-dotted underline-offset-4 hover:text-gray-900 dark:hover:text-gray-100"
              target="_blank"
              rel="noreferrer"
            >
              Bezoek de webshop
            </a>
          ) : null}
        </div>

        <div className="space-y-2">
          <p className="text-base font-semibold text-gray-900 dark:text-gray-50">Volg ons</p>
          {socialLinks.length ? (
            <ul className="space-y-1">
              {socialLinks.map(({ href, label }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="underline decoration-dotted underline-offset-4 hover:text-gray-900 dark:hover:text-gray-100"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>Geen sociale kanalen gedeeld.</p>
          )}
        </div>
      </div>
      <div className="border-t border-gray-200 bg-white text-xs text-gray-500 transition-colors dark:border-slate-800 dark:bg-slate-950 dark:text-gray-400">
        <div className="container flex flex-col-reverse items-center gap-4 py-4 md:relative md:flex-row md:items-center md:gap-0">
          <div className="flex w-full items-center justify-center">
            <p className="text-center text-xs text-gray-500 transition-colors dark:text-gray-400">
              © {currentYear} {metaData?.clientName ?? "Onbekende organisatie"}. Alle rechten
              voorbehouden.
            </p>
          </div>
          <div className="pointer-events-auto flex items-center justify-center md:absolute md:right-6 md:top-1/2 md:-translate-y-1/2">
            <ThemeSwitcher variant="inline" />
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
