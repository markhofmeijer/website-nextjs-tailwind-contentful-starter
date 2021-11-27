import React from "react"

import { IAppDataProps } from "@/types/app"

const Footer: React.FC<IAppDataProps> = ({ data }) => {
  const authorName = "Click-Designs"
  const authorWebsite = "https://www.click-designs.nl"

  return (
    <footer>
      <div className="container md:flex justify-between py-2 text-xs bg-gray-300">
        <div className="md:flex md:items-center">INFO</div>
        <div className="mt-3 md:mt-0 md:flex md:items-center">ICONS</div>
        <div className="mt-8 md:mt-0 flex items-center justify-center">
          <a href={authorWebsite} target="blank" className="hover:underline">
            <span className="whitespace-no-wrap">
              {`©${new Date().getFullYear()} - ${authorName}`}
            </span>
          </a>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
