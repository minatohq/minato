import { createFileRoute, Link } from '@tanstack/react-router'
import { APP_NAME } from '@repo/constants/app'
import { FieldSeparator } from '@/components/ui/Field'
import { AuthCard } from '@/features/auth/components/AuthCard'
import { AuthParagraph } from '@/features/auth/components/AuthParagraph'
import { AuthSocialButtonGroup } from '@/features/auth/components/AuthSocialButtonGroup'
import { SignUpForm } from '@/features/auth/components/forms/SignUpForm'
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
