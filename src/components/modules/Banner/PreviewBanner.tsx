import Link from "next/link"

const PreviewBanner = () => (
  <div className="bg-amber-100 text-amber-900">
    <div className="container flex flex-col gap-2 py-3 text-sm font-semibold sm:flex-row sm:items-center sm:justify-between">
      <span>Preview modus is ingeschakeld.</span>
      <Link href="/api/exit-preview" className="underline hover:text-amber-700">
        Klik hier om af te sluiten
      </Link>
    </div>
  </div>
)

export { PreviewBanner }
