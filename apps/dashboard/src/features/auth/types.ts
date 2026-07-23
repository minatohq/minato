import type { authClient } from '@/features/auth/client'

export type AuthSession = typeof authClient.$Infer.Session
