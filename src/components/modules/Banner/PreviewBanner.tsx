import React from "react"
import Link from "next/link"

const PreviewBanner: React.FC = () => (
  <div className="p-4 bg-yellow-100 border border-yellow-300 text-center text-sm font-semibold">
    This is a preview,{" "}
    <Link href={`/api/exit-preview`}>
      <a className="underline hover:text-cyan duration-200 transition-colors">
        click here to close
      </a>
    </Link>
  </div>
)

export { PreviewBanner }
