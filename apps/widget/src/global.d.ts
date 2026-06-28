import type { WidgetApi } from './bootstrap/types'
import { APP_NAME } from './bootstrap/constants'

declare global {
  interface Window {
    [APP_NAME]?: WidgetApi
  }
}
