"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const SunIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className}>
    <path
      d="M12 4V2m0 20v-2m8-8h2M2 12h2m15.071-7.071 1.414-1.414M5.515 18.485l-1.414 1.414m0-16.97L5.515 5.515m12.142 12.97 1.414 1.414M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
)

const MoonIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className}>
    <path
      d="M21 14.5A8.5 8.5 0 0 1 9.5 3a8.5 8.5 0 1 0 11.5 11.5Z"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
)

const LaptopIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden className={className}>
    <rect
      x="4"
      y="5"
      width="16"
      height="11"
      rx="1.5"
      stroke="currentColor"
      strokeWidth={1.5}
      fill="none"
    />
    <path d="M2 19h20" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
  </svg>
)

const themeOptions = [
  { value: "system", label: "Systeem", Icon: LaptopIcon },
  { value: "light", label: "Licht", Icon: SunIcon },
  { value: "dark", label: "Donker", Icon: MoonIcon },
] as const

interface ThemeSwitcherProps {
  variant?: "card" | "inline"
}

const ThemeSwitcher = ({ variant = "card" }: ThemeSwitcherProps) => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const activeTheme = mounted ? (theme ?? "system") : "system"

  if (variant === "inline") {
    return (
      <div className="flex items-center gap-2">
        {themeOptions.map(({ value, label, Icon }) => {
          const isActive = activeTheme === value
          return (
            <button
              key={value}
              type="button"
              title={label}
              aria-label={label}
              aria-pressed={isActive}
              onClick={() => setTheme(value)}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 ${
                isActive
                  ? "border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-500/50 dark:bg-orange-500/10 dark:text-orange-100"
                  : "border-gray-300 hover:border-gray-400 dark:border-slate-700 dark:hover:border-slate-500"
              }`}
            >
              <Icon className="h-4 w-4" />
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="w-full max-w-xs rounded-2xl border border-gray-200 bg-white p-4 text-left text-gray-600 shadow-sm transition dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300 dark:shadow-slate-900/40">
      <div className="flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Thema
        <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">Voorkeur</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {themeOptions.map(({ value, label, Icon }) => {
          const isActive = activeTheme === value
          return (
            <button
              key={value}
              type="button"
              aria-pressed={isActive}
              onClick={() => setTheme(value)}
              className={`flex flex-col items-center rounded-xl border px-3 py-2 text-xs font-medium transition ${
                isActive
                  ? "border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-500/40 dark:bg-orange-500/10 dark:text-orange-100"
                  : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-slate-700 dark:text-gray-300 dark:hover:border-slate-600 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="mt-1">{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { ThemeSwitcher }
