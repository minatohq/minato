export enum Theme {
  Dark = 'dark',
  Light = 'light',
  System = 'system',
}

export interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
}

export interface ThemeProviderState {
  theme: Theme
  setTheme: (theme: Theme) => void
}
