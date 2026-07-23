import * as Sentry from '@sentry/tanstackstart-react'
import { env } from '@/lib/env'

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: env.VITE_SENTRY_DASHBOARD_DSN,
  })
}
