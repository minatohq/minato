import { z } from 'zod'

export const clientEnvSchema = z.object({
  VITE_LAUNCHER_URL: z.string().min(1),
})
