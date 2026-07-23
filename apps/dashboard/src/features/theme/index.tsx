import { ScriptOnce } from '@tanstack/react-router'
import { createContext, useContext, useEffect, useState } from 'react'
import { THEME_STORAGE_KEY } from '@repo/constants/storages'
import { applyInitialTheme } from '@/features/theme/script'
import { Theme, ThemeProviderProps, ThemeProviderState } from '@/features/theme/types'

const MEDIA_QUERY = '(prefers-color-scheme: dark)'
const DISABLE_TRANSITIONS_CSS = '*,*::before,*::after{transition:none!important;}'

const ThemeContext = createContext<ThemeProviderState | undefined>(undefined)

function disableTransitions() {
  const style = document.createElement('style')
  style.textContent = DISABLE_TRANSITIONS_CSS
  document.head.appendChild(style)

  return () => {
    // Force restyle
    window.getComputedStyle(document.body)

    // Wait for next tick before removing
    setTimeout(() => {
      style.remove()
    }, 1)
  }
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  const resolvedTheme: Theme =
    theme === Theme.System
      ? window.matchMedia(MEDIA_QUERY).matches
        ? Theme.Dark
        : Theme.Light
      : theme

  const restoreTransitions = disableTransitions()

  root.classList.remove(Theme.Light, Theme.Dark)
  root.classList.add(resolvedTheme)
  root.style.colorScheme = resolvedTheme

  restoreTransitions()
}

export function ThemeProvider({ children, defaultTheme = Theme.System }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [isMounted, setIsMounted] = useState(false)

  // Restore the persisted preference after hydration.
  useEffect(() => {
    queueMicrotask(() => {
      let storedTheme: string | null = null

      try {
        storedTheme = localStorage.getItem(THEME_STORAGE_KEY)
      } catch {
        // Unsupported
      }

      setThemeState(
        storedTheme === Theme.Light || storedTheme === Theme.Dark || storedTheme === Theme.System
          ? storedTheme
          : defaultTheme
      )

      setIsMounted(true)
    })
  }, [defaultTheme])

  // Apply the selected preference once the provider has mounted.
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
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Unsupported
    }

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
