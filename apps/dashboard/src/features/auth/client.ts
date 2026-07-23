import { lastLoginMethodClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import { LAST_USED_LOGIN_METHOD_COOKIE_NAME } from '@repo/constants/cookies'

export const authClient = createAuthClient({
  plugins: [
    lastLoginMethodClient({
      cookieName: LAST_USED_LOGIN_METHOD_COOKIE_NAME,
    }),
  ],
})

export const useSession = authClient.useSession
