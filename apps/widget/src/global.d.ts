import { APP_NAME } from '@repo/constants/app'
import type { WidgetApi } from './bootstrap/types'

declare global {
  interface Window {
    [APP_NAME]?: WidgetApi
  }
}
