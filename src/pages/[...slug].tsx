import React from "react"
import { ParsedUrlQuery } from "querystring"
import { GetStaticProps, GetStaticPaths } from "next"

import { Layout } from "@/components/layouts"
import getPageSlugs from "@/utils/contentful/page/getPageSlugs"
import getPageBySlug from "@/utils/contentful/page/getPageBySlug"
import getSiteMetadata from "@/utils/contentful/siteMetadata/getSiteMetadata"

import { IAppData, IAppDataProps } from "@/types/app"

const Home: React.FC<IAppDataProps> = ({ data }) => {
  return (
    <Layout data={data}>
      <div className="container bg-pink-300">DYNAMIC PAGE</div>
    </Layout>
  )
}

interface IParams extends ParsedUrlQuery {
  slug: string
}

export const getStaticProps: GetStaticProps = async ({ preview = false, params }) => {
  const { slug } = params as IParams
  const page = await getPageBySlug(slug, preview)
  const metaData = await getSiteMetadata(preview)

  const data: IAppData = {
    preview,
    page,
    metaData,
  }

  return {
    props: {
      data,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const pageSlugs = await getPageSlugs()
  const paths =
    pageSlugs.filter(({ slug }) => !["/"].includes(slug)).map(({ slug }) => `/${slug}`) ?? []

  return {
    paths,
    fallback: false,
  }
}

export default Home
