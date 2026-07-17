import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,

  server: {
    AUTH_BASE_URL: z.url(),
    AUTH_SECRET: z.string().length(64),
    DATABASE_URL: z.url(),
  },
})
