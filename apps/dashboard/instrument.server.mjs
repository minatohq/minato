import * as Sentry from '@sentry/tanstackstart-react'

const dsn = process.env.VITE_SENTRY_DASHBOARD_DSN

if (!dsn) {
  throw new Error('VITE_SENTRY_DASHBOARD_DSN is not defined')
}

Sentry.init({
  dsn,
})
