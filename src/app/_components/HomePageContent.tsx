import type { IPage } from "@/types/page"
import type { IProduct } from "@/types/product"

import { DefaultPageSection } from "./DefaultPageSection"
import { ProductGrid } from "./ProductGrid"

interface HomePageContentProps {
  breadcrumbPath: string
  page: IPage
  products: IProduct[]
}

const HomePageContent = ({ breadcrumbPath, page, products }: HomePageContentProps) => {
  return (
    <div className="space-y-10">
      <DefaultPageSection
        breadcrumbPath={breadcrumbPath}
        title={page.title}
        description={page.description}
        slug={page.slug}
        emptyDescriptionMessage="Deze pagina heeft nog geen beschrijving."
      />

      <ProductGrid
        products={products}
        eyebrow="Producten"
        heading="Uitgelichte producten"
        columnClassName="md:grid-cols-2"
      />
    </div>
  )
}

export { HomePageContent }
