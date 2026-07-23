import type { Theme } from '@/features/theme/types'

export function applyInitialTheme(storageKey: string, defaultTheme: Theme) {
  let theme: string | null = defaultTheme

  try {
    theme = localStorage.getItem(storageKey)
  } catch {
    // Use the default theme when storage is unavailable.
  }

  try {
    if (theme !== 'light' && theme !== 'dark' && theme !== 'system') {
      theme = defaultTheme
    }

    const resolvedTheme =
      theme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : theme

    const root = document.documentElement

    root.classList.add(resolvedTheme)
    root.style.colorScheme = resolvedTheme
  } catch {
    // Ignore initial theme failures
  }
}
