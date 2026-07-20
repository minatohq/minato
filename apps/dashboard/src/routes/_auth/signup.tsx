import { createFileRoute, Link } from '@tanstack/react-router'
import { APP_NAME } from '@repo/constants/app'
import { AuthCard } from '@/components/auth/AuthCard'
import { AuthParagraph } from '@/components/auth/AuthParagraph'
import { AuthSocialButtonGroup } from '@/components/auth/AuthSocialButtonGroup'
import { SignUpForm } from '@/components/forms/SignUpForm'
import { FieldSeparator } from '@/components/ui/Field'
import { createPageTitle } from '@/lib/metadata'

const termsOfServiceUrl = new URL('/terms', import.meta.env.VITE_WEBSITE_BASE_URL).toString()
const privacyPolicyUrl = new URL('/privacy', import.meta.env.VITE_WEBSITE_BASE_URL).toString()

export const Route = createFileRoute('/_auth/signup')({
  head: () => ({
    meta: [
      { title: createPageTitle('Create account') },
      {
        name: 'description',
        content: `Create a ${APP_NAME} account and start collecting customer feedback.`,
      },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <AuthCard
        title="Create your account"
        description="Start collecting feedback in just a few minutes."
      >
        <AuthSocialButtonGroup mode="signup" />

        <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
          or
        </FieldSeparator>

        <SignUpForm />

        <AuthParagraph className="text-center">
          Already have an account? <Link to="/login">Log in</Link>
        </AuthParagraph>
      </AuthCard>

      <AuthParagraph className="px-12 text-center">
        By creating an account, you agree to our{' '}
        <a href={termsOfServiceUrl} target="_blank" rel="noreferrer">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href={privacyPolicyUrl} target="_blank" rel="noreferrer">
          Privacy Policy
        </a>
        .
      </AuthParagraph>
    </>
  )
}
