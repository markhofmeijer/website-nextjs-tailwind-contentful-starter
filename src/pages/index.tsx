import type { NextPage } from "next"
import { GetStaticProps } from "next"

import { Layout } from "@/components/layouts"
import getPageBySlug from "@/utils/contentful/page/getPageBySlug"
import getSiteNavigationItems from "@/utils/contentful/siteNavigation/getSiteNavigationItems"
import getSiteMetadata from "@/utils/contentful/siteMetadata/getSiteMetadata"
import getHomepageProducts from "@/utils/contentful/product/getHomepageProducts"

import { IAppData, IAppDataProps } from "@/types/app"

const Home: NextPage<IAppDataProps> = ({ data }) => {
  return (
    <Layout data={data}>
      <div className="bg-blue-200">FULL PAGE CONTENT</div>
      <div className="container bg-blue-300">SCOPED FULL PAGE CONTENT</div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  const page = await getPageBySlug("/", preview)
  const navItems = await getSiteNavigationItems(preview)
  const metaData = await getSiteMetadata(preview)
  const products = await getHomepageProducts(preview, true)

  const data: IAppData = {
    preview,
    page,
    navItems,
    metaData,
    products,
  }

  return {
    props: {
      data,
    },
  }
}

export default Home
