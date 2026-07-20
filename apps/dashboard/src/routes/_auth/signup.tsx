import { createFileRoute, Link } from '@tanstack/react-router'
import { APP_NAME } from '@repo/constants/app'
import { AuthParagraph } from '@/components/auth/AuthParagraph'
import { AuthSocialButtonGroup } from '@/components/auth/AuthSocialButtonGroup'
import { SignUpForm } from '@/components/forms/SignUpForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
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
      <Card>
        <CardHeader className="text-center">
          <CardTitle>
            <h1>Create your account</h1>
          </CardTitle>

          <CardDescription className="text-balance">
            Start collecting feedback in just a few minutes.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6">
          <AuthSocialButtonGroup mode="signup" />

          <FieldSeparator>or</FieldSeparator>

          <SignUpForm />

          <AuthParagraph className="text-center">
            Already have an account? <Link to="/login">Log in</Link>
          </AuthParagraph>
        </CardContent>
      </Card>

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
