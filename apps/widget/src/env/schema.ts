import { z } from 'zod'

export const clientEnvSchema = z.object({
  VITE_API_BASE_URL: z.url(),
  VITE_POPUP_URL: z.string().min(1),
  VITE_LAUNCHER_URL: z.string().min(1),
})
