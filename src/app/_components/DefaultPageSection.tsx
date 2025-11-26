import type { Document } from "@contentful/rich-text-types"

import { Markdown } from "@/components/elements/Markdown"

interface DefaultPageSectionProps {
  breadcrumbPath: string
  title?: string | null
  description?: Document | string | null
  slug?: string | null
  emptyDescriptionMessage?: string
}

const DefaultPageSection = ({
  breadcrumbPath,
  title,
  description,
  slug,
  emptyDescriptionMessage = "Deze pagina heeft nog geen content.",
}: DefaultPageSectionProps) => {
  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
        {breadcrumbPath}
      </p>
      <h1 className="mt-2 text-4xl font-bold text-gray-900">{title}</h1>
      {description ? (
        <div className="mt-6 prose max-w-none text-gray-700">
          <Markdown src={description} label={`page:${slug ?? "unknown"}`} />
        </div>
      ) : (
        <p className="mt-6 text-gray-600">{emptyDescriptionMessage}</p>
      )}
    </section>
  )
}

export { DefaultPageSection }
