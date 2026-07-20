import { Resend } from 'resend'
import { APP_NAME } from '@repo/constants/app'
import { env } from '#/env'

export const resend = new Resend(env.RESEND_API_KEY)

export const TRANSACTIONAL_EMAIL = 'noreply@mail.minato.so'
export const TRANSACTIONAL_FROM_EMAIL = `${APP_NAME} <${TRANSACTIONAL_EMAIL}>`
