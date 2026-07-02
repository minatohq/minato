import { z } from 'zod'

export const clientEnvSchema = z.object({
  VITE_API_BASE_URL: z.url(),
  VITE_LAUNCHER_URL: z.string().min(1),
})
