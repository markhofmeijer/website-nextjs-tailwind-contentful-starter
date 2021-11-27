import React, { useState } from "react"

import { IAppDataProps } from "@/types/app"

const Header: React.FC<IAppDataProps> = ({ data }) => {
  const [drawerIsVisible, setDrawerIsVisible] = useState(false)
  const drawerToggleHandler = () => setDrawerIsVisible(!drawerIsVisible)

  return (
    <header>
      <div className="container bg-gray-300">
        <div className="relative py-4 md:pt-6 md:pb-0">
          <div className="flex justify-center">LOGO</div>
        </div>
        <nav className="hidden md:block bg-yellow-100">NAV</nav>

        <div className="relative md:hidden mx-6 mb-6">
          <button
            type="button"
            className="group w-full inline-flex justify-between py-1 px-2 bg-yellow-100 hover:bg-yellow-200 border border-yellow-200 rounded text-sm tracking-wide"
            onClick={drawerToggleHandler}
          >
            Selecteer een pagina
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-6 h-6 text-yellow-300 group-hover:text-yellow-400"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          {drawerIsVisible ? (
            <div className="absolute left-0 right-0 z-50 pt-3">
              <nav
                className="bg-yellow-100 bg-opacity-90 border-t-4 border-primary p-3 text-black"
                onClick={drawerToggleHandler}
              >
                NAV
              </nav>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}

export { Header }
