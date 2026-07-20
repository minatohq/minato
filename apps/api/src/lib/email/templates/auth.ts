import { APP_NAME } from '@repo/constants/app'

export function getPasswordResetEmailText(url: string) {
  return `Reset your ${APP_NAME} password

We received a request to reset your ${APP_NAME} password.

Click the link below to reset your password:

${url}

If you didn't request a password reset, you can safely ignore this email.`
}
