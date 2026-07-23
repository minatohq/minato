import { ScriptOnce } from '@tanstack/react-router'
import { createContext, useContext, useEffect, useState } from 'react'
import { THEME_STORAGE_KEY } from '@repo/constants/storages'
import { applyInitialTheme } from '@/features/theme/script'
import { Theme, ThemeProviderProps, ThemeProviderState } from '@/features/theme/types'

const MEDIA_QUERY = '(prefers-color-scheme: dark)'

const ThemeContext = createContext<ThemeProviderState | undefined>(undefined)

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.remove(Theme.Light, Theme.Dark)

  const resolvedTheme: Theme =
    theme === Theme.System
      ? window.matchMedia(MEDIA_QUERY).matches
        ? Theme.Dark
        : Theme.Light
      : theme

  root.classList.add(resolvedTheme)
  root.style.colorScheme = resolvedTheme
}

export function ThemeProvider({ children, defaultTheme = Theme.System }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [isMounted, setIsMounted] = useState(false)

  // Restore the persisted preference after hydration without changing the server-rendered state.
  useEffect(() => {
    queueMicrotask(() => {
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY)

      setThemeState(
        storedTheme === Theme.Light || storedTheme === Theme.Dark || storedTheme === Theme.System
          ? storedTheme
          : defaultTheme
      )

      setIsMounted(true)
    })
  }, [defaultTheme])

  // Apply the selected preference to the document once the provider has mounted.
  useEffect(() => {
    if (!isMounted) {
      return
    }

    applyTheme(theme)
  }, [theme, isMounted])

  // Follow OS color-scheme changes if the user preference is System.
  useEffect(() => {
    if (!isMounted || theme !== Theme.System) {
      return
    }

    const onChange = () => applyTheme(Theme.System)

    const media = window.matchMedia(MEDIA_QUERY)
    media.addEventListener('change', onChange)

    return () => media.removeEventListener('change', onChange)
  }, [theme, isMounted])

  // Synchronize the preference when it is changed in another browser tab.
  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key !== THEME_STORAGE_KEY) {
        return
      }

      const nextTheme = event.newValue

      setThemeState(
        nextTheme === Theme.Light || nextTheme === Theme.Dark || nextTheme === Theme.System
          ? nextTheme
          : defaultTheme
      )
    }

    window.addEventListener('storage', onStorage)

    return () => window.removeEventListener('storage', onStorage)
  }, [defaultTheme])

  function setTheme(next: Theme) {
    localStorage.setItem(THEME_STORAGE_KEY, next)
    setThemeState(next)
  }

  return (
    <ThemeContext value={{ theme, setTheme }}>
      <ScriptOnce>
        {`(${applyInitialTheme.toString()})(${JSON.stringify(THEME_STORAGE_KEY)}, ${JSON.stringify(defaultTheme)})`}
      </ScriptOnce>
      {children}
    </ThemeContext>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}
