import { z } from 'zod'

export const clientEnvSchema = z.object({
  VITE_DASHBOARD_BASE_URL: z.url(),
  VITE_SENTRY_DASHBOARD_DSN: z.url(),
  VITE_WEBSITE_BASE_URL: z.url(),
})

export const serverEnvSchema = z.object({
  API_PROXY_TARGET: z.url(),
  SENTRY_AUTH_TOKEN: z.string(),
  SENTRY_DASHBOARD_PROJECT_NAME: z.string(),
  SENTRY_ORG_NAME: z.string(),
})

// oxfmt-ignore
export const envKeys = [
  ...clientEnvSchema.keyof().options,
  ...serverEnvSchema.keyof().options,
]
