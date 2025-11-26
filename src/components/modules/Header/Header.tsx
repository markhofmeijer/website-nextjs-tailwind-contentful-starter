"use client"

import Link from "next/link"
import type { Route } from "next"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { CSSProperties, FocusEvent, MouseEvent, ReactNode, RefObject } from "react"

import { Logo } from "@/components/elements/Logo"
import { INavigationItem } from "@/types/navigation"

interface HeaderProps {
  navItems?: INavigationItem[]
}

const resolveHref = (slug: string | null) => {
  if (!slug) return null
  if (slug === "/" || slug === "home") return "/"
  return slug.startsWith("/") ? slug : `/${slug}`
}

const normalizePath = (value: string | null) => {
  if (!value) return null
  const withoutQuery = value.split("?")[0]?.split("#")[0] ?? value
  if (!withoutQuery || withoutQuery === "/") return "/"
  return withoutQuery.replace(/\/+$/, "") || "/"
}

const Header = ({ navItems = [] }: HeaderProps) => {
  const pathname = usePathname()
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [panelOffset, setPanelOffset] = useState(0)
  const [panelWidth, setPanelWidth] = useState(0)
  const [displayedMenuItem, setDisplayedMenuItem] = useState<INavigationItem | null>(null)
  const [isPanelVisible, setIsPanelVisible] = useState(false)
  const [isPanelHovered, setIsPanelHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hidePanelTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const normalizedPath = useMemo(() => normalizePath(pathname ?? "/") ?? "/", [pathname])

  const isHrefActive = useCallback(
    (href: string | null) => {
      const normalizedHref = normalizePath(href)
      if (!normalizedHref) return false
      if (normalizedHref === "/") {
        return normalizedPath === "/"
      }
      return normalizedPath === normalizedHref
    },
    [normalizedPath],
  )

  const isItemActive = useCallback(
    (navItem: INavigationItem | null): boolean => {
      if (!navItem) return false
      if (isHrefActive(resolveHref(navItem.slug))) {
        return true
      }
      return navItem.subItems?.some(child => isItemActive(child)) ?? false
    },
    [isHrefActive],
  )

  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }, [])

  const clearHidePanelTimeout = useCallback(() => {
    if (hidePanelTimeoutRef.current) {
      clearTimeout(hidePanelTimeoutRef.current)
      hidePanelTimeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      clearCloseTimeout()
      clearHidePanelTimeout()
    }
  }, [clearCloseTimeout, clearHidePanelTimeout])

  const closeAll = useCallback(() => {
    clearCloseTimeout()
    clearHidePanelTimeout()
    setActiveMenuId(null)
    setMobileMenuOpen(false)
    triggerRef.current = null
    setIsPanelVisible(false)
    hidePanelTimeoutRef.current = setTimeout(() => {
      setDisplayedMenuItem(null)
    }, 150)
  }, [clearCloseTimeout, clearHidePanelTimeout])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAll()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [closeAll])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    clearHidePanelTimeout()
    if (activeMenuId) {
      setDisplayedMenuItem(navItems.find(item => item.id === activeMenuId) ?? null)
      requestAnimationFrame(() => setIsPanelVisible(true))
      return
    }

    setIsPanelVisible(false)
    hidePanelTimeoutRef.current = setTimeout(() => {
      setDisplayedMenuItem(null)
    }, 150)
  }, [activeMenuId, navItems, clearHidePanelTimeout])

  const measurePanelWidth = useCallback(() => {
    if (!panelRef.current) {
      return panelWidth
    }
    const width = panelRef.current.getBoundingClientRect().width
    if (width !== panelWidth) {
      setPanelWidth(width)
    }
    return width
  }, [panelWidth])

  const updatePanelOffset = useCallback(
    (element?: HTMLElement | null, widthOverride?: number) => {
      const target = element ?? triggerRef.current
      const container = containerRef.current
      if (!target || !container) return

      const containerRect = container.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()
      const panelWidthValue = widthOverride ?? panelWidth

      if (!panelWidthValue) {
        setPanelOffset(Math.max(0, targetRect.left - containerRect.left))
        return
      }

      const triggerCenter = targetRect.left - containerRect.left + targetRect.width / 2
      const maxOffset = Math.max(0, containerRect.width - panelWidthValue)
      const centeredOffset = triggerCenter - panelWidthValue / 2
      setPanelOffset(Math.min(Math.max(0, centeredOffset), maxOffset))
    },
    [panelWidth],
  )

  useEffect(() => {
    if (!displayedMenuItem) return
    const frame = requestAnimationFrame(() => {
      const width = measurePanelWidth()
      updatePanelOffset(undefined, width)
    })

    return () => cancelAnimationFrame(frame)
  }, [displayedMenuItem, measurePanelWidth, updatePanelOffset])

  useEffect(() => {
    const handleResize = () => {
      if (activeMenuId) {
        const width = measurePanelWidth()
        updatePanelOffset(undefined, width)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [activeMenuId, measurePanelWidth, updatePanelOffset])

  useEffect(() => {
    if (!activeMenuId) return
    const width = measurePanelWidth()
    updatePanelOffset(undefined, width)
  }, [activeMenuId, measurePanelWidth, updatePanelOffset])

  const activeMenuItem = useMemo(
    () => navItems.find(item => item.id === activeMenuId) ?? null,
    [navItems, activeMenuId],
  )

  return (
    <header className="relative z-40 border-b border-gray-200 bg-white text-gray-900 transition-colors dark:border-slate-800 dark:bg-slate-900 dark:text-gray-100">
      <div className="container flex items-center gap-6 py-4" ref={containerRef}>
        <Logo link="/" />
        <DesktopNav
          items={navItems}
          activeMenuId={activeMenuId}
          onMenuChange={setActiveMenuId}
          onAlignPanel={(id, el) => {
            triggerRef.current = el
            setActiveMenuId(id)
            const width = measurePanelWidth()
            updatePanelOffset(el, width)
          }}
          isHrefActive={isHrefActive}
          isItemActive={isItemActive}
          onNavEnter={clearCloseTimeout}
          onNavLeave={() => {
            clearCloseTimeout()
            closeTimeoutRef.current = setTimeout(() => {
              if (!isPanelHovered) {
                setActiveMenuId(null)
                triggerRef.current = null
              }
            }, 100)
          }}
          onNavigate={closeAll}
        />
        <div className="ml-auto lg:hidden">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-900 transition hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100 dark:hover:bg-slate-700"
            aria-label="Open navigatie"
            onClick={() => setMobileMenuOpen(true)}
          >
            <HamburgerIcon />
          </button>
        </div>
      </div>

      <MegaPanel
        item={displayedMenuItem}
        panelRef={panelRef}
        offset={panelOffset}
        visible={isPanelVisible}
        isHrefActive={isHrefActive}
        isItemActive={isItemActive}
        onHoverChange={hovering => {
          setIsPanelHovered(hovering)
          if (hovering) {
            clearCloseTimeout()
          }
        }}
        onClose={() => setActiveMenuId(null)}
        onNavigate={closeAll}
      />
      <MobileNav
        items={navItems}
        isOpen={isMobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        isHrefActive={isHrefActive}
        isItemActive={isItemActive}
        onNavigate={closeAll}
      />
    </header>
  )
}

interface DesktopNavProps {
  items: INavigationItem[]
  activeMenuId: string | null
  onMenuChange: (id: string | null) => void
  onAlignPanel: (id: string, element: HTMLElement) => void
  isHrefActive: (href: string | null) => boolean
  isItemActive: (item: INavigationItem | null) => boolean
  onNavEnter: () => void
  onNavLeave: () => void
  onNavigate: () => void
}

const DesktopNav = ({
  items,
  activeMenuId,
  onMenuChange,
  onAlignPanel,
  isHrefActive,
  isItemActive,
  onNavEnter,
  onNavLeave,
  onNavigate,
}: DesktopNavProps) => {
  if (!items.length) {
    return null
  }

  return (
    <nav
      className="hidden flex-1 items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 lg:flex"
      onMouseEnter={onNavEnter}
      onMouseLeave={onNavLeave}
    >
      {items.map(item => {
        const href = resolveHref(item.slug)
        const hasSubItems = Boolean(item.subItems?.length)
        const linkActive = isHrefActive(href)
        const itemActive = isItemActive(item)

        if (!hasSubItems) {
          return (
            <NavLink
              key={item.id}
              href={href}
              label={item.name ?? "Pagina"}
              onClick={onNavigate}
              onMouseEnter={_event => {
                onMenuChange(null)
              }}
              onFocus={_event => {
                onMenuChange(null)
              }}
              className={`rounded-full px-4 py-2.5 text-base transition ${
                linkActive
                  ? "bg-orange-50 text-orange-600 dark:bg-orange-500/20 dark:text-orange-200"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-slate-800 dark:hover:text-gray-50"
              }`}
            />
          )
        }

        const isActive = item.id === activeMenuId

        return (
          <div key={item.id} className="inline-flex items-center rounded-full">
            <NavLink
              href={href}
              label={item.name ?? "Pagina"}
              onClick={onNavigate}
              onMouseEnter={(event: MouseEvent<HTMLAnchorElement>) => {
                onAlignPanel(item.id, event.currentTarget)
              }}
              onFocus={(event: FocusEvent<HTMLAnchorElement>) => {
                onAlignPanel(item.id, event.currentTarget)
              }}
              className={`flex items-center gap-3 rounded-full px-4 py-2.5 text-base transition ${
                itemActive
                  ? "bg-orange-50 text-orange-600 dark:bg-orange-500/20 dark:text-orange-100"
                  : "text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-slate-800"
              }`}
            >
              <span>{item.name ?? "Pagina"}</span>
              <span
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition ${
                  itemActive
                    ? "border-orange-200 bg-orange-50 text-orange-600 dark:border-orange-500/40 dark:bg-orange-500/10 dark:text-orange-100"
                    : "border-gray-200 bg-white text-gray-500 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-400"
                }`}
                aria-hidden
              >
                <ChevronIcon
                  className={`h-4 w-4 transition ${isActive ? "-rotate-180" : "rotate-0"}`}
                />
              </span>
            </NavLink>
          </div>
        )
      })}
    </nav>
  )
}

interface MegaPanelProps {
  item: INavigationItem | null
  panelRef: RefObject<HTMLDivElement>
  offset: number
  visible: boolean
  isHrefActive: (href: string | null) => boolean
  isItemActive: (item: INavigationItem | null) => boolean
  onHoverChange: (hovering: boolean) => void
  onClose: () => void
  onNavigate: () => void
}

const MegaPanel = ({
  item,
  panelRef,
  offset,
  visible,
  isHrefActive,
  isItemActive,
  onHoverChange,
  onClose,
  onNavigate,
}: MegaPanelProps) => {
  if (!item || !item.subItems?.length) {
    return null
  }

  return (
    <div className="absolute left-0 top-full hidden w-full lg:block">
      <div
        className={`container flex justify-start transition-all duration-200 ease-out ${
          visible ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-1"
        }`}
        onMouseEnter={() => onHoverChange(true)}
        onMouseLeave={() => {
          onHoverChange(false)
          onClose()
        }}
      >
        <div
          className="mt-2 w-auto max-w-6xl rounded-3xl border border-gray-200 bg-white px-8 py-4 shadow-2xl max-h-[75vh] overflow-y-auto dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-900/40"
          ref={panelRef}
          style={{ marginLeft: offset }}
        >
          <div className="flex w-full flex-col gap-6">
            {item.subItems.map(section => {
              const sectionHref = resolveHref(section.slug)
              const sectionIsActive = isItemActive(section)
              const sectionLinkActive = isHrefActive(sectionHref)
              const sectionHasChildren = Boolean(section.subItems?.length)

              return (
                <div
                  key={section.id}
                  className={`w-full rounded-2xl border p-5 transition ${
                    sectionIsActive
                      ? "border-orange-200 bg-orange-50 dark:border-orange-500/40 dark:bg-orange-500/10"
                      : "border-gray-100 bg-gray-50 hover:bg-gray-100 dark:border-slate-800 dark:bg-slate-800/60 dark:hover:bg-slate-800"
                  }`}
                >
                  <div
                    className={`flex items-center gap-3 ${sectionHasChildren ? "justify-between" : "justify-start"}`}
                  >
                    <NavLink
                      href={sectionHref}
                      label={section.name ?? "Sectie"}
                      onClick={onNavigate}
                      className={`text-base font-semibold ${
                        sectionLinkActive
                          ? "text-orange-600 dark:text-orange-200"
                          : "text-gray-900 dark:text-gray-50"
                      }`}
                    />
                    {sectionHasChildren ? (
                      <ChevronIcon
                        className={`h-3 w-3 ${
                          sectionIsActive ? "text-orange-500" : "text-gray-400 dark:text-gray-500"
                        }`}
                      />
                    ) : null}
                  </div>
                  {sectionHasChildren ? (
                    <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                      <MegaPanelChildLinks
                        items={section.subItems}
                        depth={0}
                        onNavigate={onNavigate}
                        isHrefActive={isHrefActive}
                      />
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

interface MobileNavProps {
  items: INavigationItem[]
  isOpen: boolean
  onClose: () => void
  isHrefActive: (href: string | null) => boolean
  isItemActive: (item: INavigationItem | null) => boolean
  onNavigate: () => void
}

const MobileNav = ({
  items,
  isOpen,
  onClose,
  isHrefActive,
  isItemActive,
  onNavigate,
}: MobileNavProps) => {
  return (
    <div
      className={`fixed inset-0 z-50 w-full transform bg-white text-gray-900 shadow-2xl transition-transform duration-300 dark:bg-slate-950 dark:text-gray-100 lg:hidden ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-slate-800">
        <span className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Navigatie
        </span>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100 dark:hover:bg-slate-700"
          aria-label="Sluit navigatie"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      </div>
      <div className="h-[calc(100%-4rem)] overflow-y-auto px-6 py-6">
        <nav className="space-y-4 text-base font-medium">
          {items.map(item => {
            const href = resolveHref(item.slug)
            const hasSubItems = Boolean(item.subItems?.length)
            const itemActive = isItemActive(item)

            return (
              <div key={item.id} className="border-b border-gray-100 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <NavLink
                    href={href}
                    label={item.name ?? "Pagina"}
                    onClick={onNavigate}
                    className={`flex-1 rounded-xl px-3 py-2 font-medium transition-colors ${
                      itemActive
                        ? "bg-orange-50 text-orange-600 dark:bg-orange-500/20 dark:text-orange-100"
                        : "text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-slate-800"
                    }`}
                  />
                  {hasSubItems ? (
                    <div
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border ${
                        itemActive
                          ? "border-orange-200 bg-orange-50 dark:border-orange-500/40 dark:bg-orange-500/10"
                          : "border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-800"
                      }`}
                    >
                      <ChevronIcon
                        className={`h-4 w-4 ${
                          itemActive ? "text-orange-500" : "text-gray-500 dark:text-gray-400"
                        }`}
                      />
                    </div>
                  ) : null}
                </div>
                {hasSubItems ? (
                  <div className="mt-3 space-y-3 border-l border-gray-100 pl-4 text-sm text-gray-600 dark:border-slate-800 dark:text-gray-300">
                    <MobileChildLinks
                      items={item.subItems}
                      onNavigate={onNavigate}
                      depth={0}
                      isHrefActive={isHrefActive}
                    />
                  </div>
                ) : null}
              </div>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

interface MobileChildLinksProps {
  items: INavigationItem[]
  depth: number
  onNavigate: () => void
  isHrefActive: (href: string | null) => boolean
}

const MobileChildLinks = ({ items, depth, onNavigate, isHrefActive }: MobileChildLinksProps) => {
  if (!items.length) return null

  const listClassName =
    depth > 0 ? "space-y-3 border-l border-gray-100 dark:border-slate-800" : "space-y-3"

  const getIndentClass = (currentDepth: number) => {
    if (currentDepth >= 3) return "pl-12"
    if (currentDepth === 2) return "pl-10"
    if (currentDepth === 1) return "pl-8"
    return "pl-4"
  }

  return (
    <ul className={listClassName}>
      {items.map(child => {
        const childHref = resolveHref(child.slug)
        const childActive = isHrefActive(childHref)
        const indentClass = getIndentClass(depth)

        return (
          <li key={child.id} className="space-y-2">
            <NavLink
              href={childHref}
              label={child.name ?? "Pagina"}
              onClick={onNavigate}
              className={`block rounded-xl py-2 pr-4 text-sm transition-colors ${indentClass} ${
                childActive
                  ? "bg-orange-50 text-orange-600 dark:bg-orange-500/20 dark:text-orange-100"
                  : "text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-slate-800"
              }`}
            />
            {child.subItems?.length ? (
              <MobileChildLinks
                items={child.subItems}
                depth={depth + 1}
                onNavigate={onNavigate}
                isHrefActive={isHrefActive}
              />
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}

interface NavLinkProps {
  href: string | null
  label: string
  className?: string
  onClick?: () => void
  onMouseEnter?: (event: MouseEvent<HTMLAnchorElement>) => void
  onFocus?: (event: FocusEvent<HTMLAnchorElement>) => void
  style?: CSSProperties
  children?: ReactNode
}

const NavLink = ({
  href,
  label,
  className = "",
  onClick,
  onMouseEnter,
  onFocus,
  style,
  children,
}: NavLinkProps) => {
  const content = children ?? label

  if (!href) {
    return (
      <span
        className={`cursor-default text-gray-400 dark:text-gray-600 ${className}`}
        style={style}
      >
        {content}
      </span>
    )
  }

  return (
    <Link
      href={href as Route}
      className={className}
      prefetch={false}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onFocus={onFocus}
      style={style}
    >
      {content}
    </Link>
  )
}

interface MegaPanelChildLinksProps {
  items: INavigationItem[]
  depth: number
  onNavigate: () => void
  isHrefActive: (href: string | null) => boolean
}

const MegaPanelChildLinks = ({
  items,
  depth,
  onNavigate,
  isHrefActive,
}: MegaPanelChildLinksProps) => {
  if (!items.length) return null

  const listClassName =
    depth > 0 ? "space-y-2 border-l border-gray-200 pl-4 dark:border-slate-800" : "space-y-2"

  return (
    <ul className={listClassName}>
      {items.map(item => {
        const itemHref = resolveHref(item.slug)
        const hasChildren = Boolean(item.subItems?.length)
        const linkActive = isHrefActive(itemHref)

        return (
          <li key={item.id} className="space-y-2">
            <NavLink
              href={itemHref}
              label={item.name ?? "Pagina"}
              onClick={onNavigate}
              className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 transition ${
                linkActive
                  ? "bg-white text-orange-600 dark:bg-slate-800 dark:text-orange-200"
                  : "text-gray-700 hover:bg-white hover:text-gray-900 dark:text-gray-300 dark:hover:bg-slate-800"
              }`}
              style={depth > 0 ? { fontSize: "0.95em" } : undefined}
            />
            {hasChildren ? (
              <MegaPanelChildLinks
                items={item.subItems}
                depth={depth + 1}
                onNavigate={onNavigate}
                isHrefActive={isHrefActive}
              />
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}

const HamburgerIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5">
    <path
      d="M4 7h16M4 12h16M4 17h16"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
    />
  </svg>
)

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5">
    <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
  </svg>
)

const ChevronIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className}>
    <path
      d="M6 9l6 6 6-6"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export { Header }
