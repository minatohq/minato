import { createEnv } from '@t3-oss/env-core'
import { clientEnvSchema, serverEnvSchema } from './schema'

const isServer = typeof window === 'undefined'

export const env = createEnv({
  runtimeEnv: {
    ...import.meta.env,
    ...(isServer ? process.env : {}),
  },

  isServer,
  emptyStringAsUndefined: true,

  clientPrefix: 'VITE_',
  client: clientEnvSchema.shape,

  server: serverEnvSchema.shape,
})
