import type { Metadata } from "next/dist/types"
import { draftMode } from "next/headers"
import type { ReactNode } from "react"

import "@/styles/globals.css"

import { Footer } from "@/components/modules/Footer"
import { Header } from "@/components/modules/Header"
import { PreviewBanner } from "@/components/modules/Banner"
import { ThemeProvider } from "@/components/providers/ThemeProvider"
import { getCachedSiteMetadata, getCachedSiteNavigation } from "./_lib/data-loaders"
import { buildMetadata } from "./_lib/seo"

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  try {
    const siteMetadata = await getCachedSiteMetadata(false)
    return buildMetadata({ siteMetadata })
  } catch (_error) {
    return {
      title: "Website",
      description: "Contentful site",
    }
  }
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const { isEnabled } = await draftMode()
  const [metaData, navItems] = await Promise.all([
    getCachedSiteMetadata(isEnabled),
    getCachedSiteNavigation(isEnabled),
  ])

  return (
    <html lang="nl" className="h-full" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-gray-50 text-gray-900 transition-colors dark:bg-slate-950 dark:text-gray-100">
        <ThemeProvider>
          {isEnabled ? <PreviewBanner /> : null}
          <Header navItems={navItems} />
          <main className="flex-1 bg-gray-100 py-10 transition-colors dark:bg-slate-900">
            <div className="container space-y-8">{children}</div>
          </main>
          <Footer metaData={metaData} />
        </ThemeProvider>
      </body>
    </html>
  )
}
