import { APP_NAME } from './bootstrap/constants'
import type { WidgetApi } from './bootstrap/types'

declare global {
  interface Window {
    [APP_NAME]?: WidgetApi
  }
}
