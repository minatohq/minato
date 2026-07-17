import { z } from 'zod'

export const clientEnvSchema = z.object({})

export const serverEnvSchema = z.object({
  API_PROXY_TARGET: z.url(),
})

// oxfmt-ignore
export const envKeys = [
  ...clientEnvSchema.keyof().options,
  ...serverEnvSchema.keyof().options,
]
