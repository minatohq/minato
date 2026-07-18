import { drizzleAdapter } from '@better-auth/drizzle-adapter/relations-v2'
import { betterAuth } from 'better-auth'
import { APP_NAME } from '@repo/constants/app'
import { createDatabaseClient } from '@repo/db'
import * as schema from '@repo/db/schema'
import { env } from '#/env'

const db = createDatabaseClient(env.DATABASE_URL)

export const auth = betterAuth({
  appName: APP_NAME,
  baseURL: env.AUTH_BASE_URL,
  secret: env.AUTH_SECRET,

  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
    schema,
  }),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      prompt: 'select_account',
    },
  },

  advanced: {
    cookiePrefix: 'minato',
  },
})
