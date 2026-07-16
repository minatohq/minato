import { z } from 'zod'

export const clientEnvSchema = z.object({
  VITE_API_BASE_URL: z.url(),
})

export const serverEnvSchema = z.object({
  DATABASE_URL: z.url(),
})

// oxfmt-ignore
export const envKeys = [
  ...clientEnvSchema.keyof().options,
  ...serverEnvSchema.keyof().options,
]
