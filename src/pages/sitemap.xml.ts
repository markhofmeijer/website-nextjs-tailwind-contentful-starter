import { GetServerSideProps } from "next"

import getPages from "@/utils/contentful/page/getPages"

const Sitemap = () => {}

const formatSitemapRecord = (url: string, updatedAt: string) =>
  `<url><loc>${url}</loc><lastmod>${updatedAt}</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url>`

export const getServerSideProps: GetServerSideProps = async ({ res, preview }) => {
  const sitemap = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ]

  // Static pages
  const staticPages = await getPages(preview)
  sitemap.push(
    staticPages
      .map(page =>
        formatSitemapRecord(
          page.seo.url ?? `${process.env.BASE_URL}/${page.slug !== "/" ? page.slug : ""}`,
          page.updatedAt
        )
      )
      .join("")
  )

  // Dynamic pages

  sitemap.push(`</urlset>`)

  res.setHeader("Content-Type", "text/xml")
  res.write(sitemap.join(""))
  res.end()

  return {
    props: {},
  }
}

export default Sitemap
