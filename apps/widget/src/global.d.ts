import type { WidgetApi } from './bootstrap/types'

declare global {
  interface Window {
    Feedy?: WidgetApi
  }
}
