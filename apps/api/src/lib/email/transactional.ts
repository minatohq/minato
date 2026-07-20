import { APP_NAME } from '@repo/constants/app'
import { TRANSACTIONAL_FROM_EMAIL, resend } from '#/lib/email/client'
import { getPasswordResetEmailText } from '#/lib/email/templates/auth'

export async function sendPasswordResetEmail({
  recipient,
  resetUrl,
}: {
  recipient: string
  resetUrl: string
}) {
  const { data, error } = await resend.emails.send({
    from: TRANSACTIONAL_FROM_EMAIL,
    to: recipient,
    subject: `Reset your ${APP_NAME} password`,
    text: getPasswordResetEmailText(resetUrl),
  })

  if (error) {
    throw new Error(`Failed to send password reset email: ${error.message}`)
  }

  return data
}
