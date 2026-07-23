import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { getSessionCookie } from 'better-auth/cookies'
import { COOKIE_PREFIX } from '@repo/constants/cookies'

export const hasSessionCookie = createServerFn({ method: 'GET' }).handler(() => {
  return Boolean(
    getSessionCookie(getRequestHeaders(), {
      cookiePrefix: COOKIE_PREFIX,
    })
  )
})
