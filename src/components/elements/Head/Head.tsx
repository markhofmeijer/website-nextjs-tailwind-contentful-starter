import React from "react"
import NextHead from "next/head"

import { IAppDataProps } from "@/types/app"

const Head: React.FC<IAppDataProps> = ({ data }) => {
  const { clientName } = data.metaData
  let { title, description, url, image, keywords } = data.metaData.seo
  let locale = null

  if (data.page) {
    const {
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      image: pageImage,
      keywords: pageKeywords,
    } = data.page.seo

    locale = data.page.locale

    if (pageTitle) title = pageTitle
    if (pageDescription) description = pageDescription
    if (pageUrl) url = pageUrl
    if (pageImage) image = pageImage
    if (
      keywords &&
      Array.isArray(keywords) &&
      keywords.length > 0 &&
      pageKeywords &&
      Array.isArray(pageKeywords) &&
      pageKeywords.length > 0
    )
      keywords = [...keywords, ...pageKeywords]
  }

  if (!url || !title || !description || !image)
    throw new Error("Required meta data missing. Please provide a: url, title, description, image")

  return (
    <NextHead>
      <title>{title}</title>
      <link rel="canonical" href={url} />
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="image" content={image.url ?? undefined} />
      <meta name="keywords" content={keywords?.join(",")} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image.url ?? undefined} />
      <meta property="og:image:width" content={`${image.dimensions.width}`} />
      <meta property="og:image:height" content={`${image.dimensions.height}`} />
      {locale ? <meta property="og:locale" content={locale} /> : null}
      <meta property="og:site_name" content={clientName} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image.url ?? undefined} />

      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="apple-touch-icon" sizes="72x72" href="/icons/icon-72x72.png" />
      <link rel="apple-touch-icon" sizes="96x96" href="/icons/icon-96x96.png" />
      <link rel="apple-touch-icon" sizes="128x128" href="/icons/icon-128x128.png" />
      <link rel="apple-touch-icon" sizes="144x144" href="/icons/icon-144x144.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
      <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
      <link rel="apple-touch-icon" sizes="384x384" href="/icons/icon-384x384.png" />
      <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512x512.png" />
      <meta name="theme-color" content="#afab96" />
    </NextHead>
  )
}

export { Head }
