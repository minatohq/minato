import { createServerFn } from '@tanstack/react-start'
import { getRequest, getRequestHeaders } from '@tanstack/react-start/server'
import { getSessionCookie } from 'better-auth/cookies'
import { COOKIE_PREFIX } from '@repo/constants/cookies'
import type { AuthSession } from '@/features/auth/types'

export const hasSessionCookie = createServerFn({ method: 'GET' }).handler(() => {
  return Boolean(
    getSessionCookie(getRequestHeaders(), {
      cookiePrefix: COOKIE_PREFIX,
    })
  )
})

export const getSession = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getRequest()

  const response = await fetch(new URL('/api/auth/get-session', request.url), {
    headers: request.headers,
  })

  if (!response.ok) {
    throw new Error(`Session lookup failed with status ${response.status}`)
  }

  return (await response.json()) as AuthSession | null
})
