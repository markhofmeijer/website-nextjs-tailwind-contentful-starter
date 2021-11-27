import { INavigationItem } from "@/types/navigation"
import { IPage } from "@/types/page"
import { IMetadata } from "@/types/metadata"
import { IProduct } from "@/types/product"

export interface IAppData {
  preview: boolean
  navItems?: INavigationItem[]
  page: IPage
  metaData: IMetadata
  products?: IProduct[]
}

export interface IAppDataProps {
  data: IAppData
}
