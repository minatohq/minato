import { ScriptOnce } from '@tanstack/react-router'
import { createContext, useContext, useEffect, useSyncExternalStore } from 'react'
import { THEME_STORAGE_KEY } from '@repo/constants/storages'
import { applyInitialTheme } from '@/features/theme/script'
import { Theme, ThemeProviderProps, ThemeProviderState } from '@/features/theme/types'

const MEDIA_QUERY = '(prefers-color-scheme: dark)'
const DISABLE_TRANSITIONS_CSS = '*,*::before,*::after{transition:none!important;}'

const ThemeContext = createContext<ThemeProviderState | undefined>(undefined)
const themeListeners = new Set<() => void>()

let inMemoryTheme: Theme | undefined

function isTheme(value: string | null): value is Theme {
  return value === Theme.Light || value === Theme.Dark || value === Theme.System
}

function getThemeSnapshot(defaultTheme: Theme) {
  if (inMemoryTheme !== undefined) {
    return inMemoryTheme
  }

  try {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY)

    return isTheme(storedTheme) ? storedTheme : defaultTheme
  } catch {
    return defaultTheme
  }
}

function subscribeToTheme(onStoreChange: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key !== THEME_STORAGE_KEY && event.key !== null) {
      return
    }

    inMemoryTheme = undefined
    onStoreChange()
  }

  themeListeners.add(onStoreChange)
  window.addEventListener('storage', onStorage)

  return () => {
    themeListeners.delete(onStoreChange)
    window.removeEventListener('storage', onStorage)
  }
}

function updateTheme(nextTheme: Theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
    inMemoryTheme = undefined
  } catch {
    // Keep the preference in memory when storage is unavailable.
    inMemoryTheme = nextTheme
  }

  for (const listener of themeListeners) {
    listener()
  }
}

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
  const theme = useSyncExternalStore(
    subscribeToTheme,
    () => getThemeSnapshot(defaultTheme),
    () => defaultTheme
  )

  // Keep the document synchronized with the selected preference.
  useEffect(() => {
    applyTheme(theme)
  }, [theme, defaultTheme])

  // Follow OS color-scheme changes if the user preference is System.
  useEffect(() => {
    if (theme !== Theme.System) {
      return
    }

    const onChange = () => applyTheme(Theme.System)

    const media = window.matchMedia(MEDIA_QUERY)
    media.addEventListener('change', onChange)

    return () => media.removeEventListener('change', onChange)
  }, [theme])

  function setTheme(next: Theme) {
    updateTheme(next)
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
