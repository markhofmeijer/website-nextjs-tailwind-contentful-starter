export interface INavigationItem {
  id: string
  name: string
  code: string | null
  slug: string | null
  subItems: INavigationItem[]
  updatedAt: string
}

interface INavProps {
  level?: number
}

export interface INavItemsProps extends INavProps {
  items: INavigationItem[]
}

export interface INavItemProps extends INavProps {
  item: INavigationItem
}
