import { createFileRoute, Link } from '@tanstack/react-router'
import { APP_NAME } from '@repo/constants/app'
import { AuthParagraph } from '@/components/auth/AuthParagraph'
import { AuthSocialButtonGroup } from '@/components/auth/AuthSocialButtonGroup'
import { LoginForm } from '@/components/forms/LoginForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { FieldSeparator } from '@/components/ui/Field'
import { createPageTitle } from '@/lib/metadata'

export const Route = createFileRoute('/_auth/login')({
  head: () => ({
    meta: [
      { title: createPageTitle('Login') },
      {
        name: 'description',
        content: `Log in to your ${APP_NAME} account.`,
      },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>
          <h1>Welcome back!</h1>
        </CardTitle>

        <CardDescription className="text-balance">
          Log in to continue to {APP_NAME} dashboard.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-6">
        <AuthSocialButtonGroup mode="login" />

        <FieldSeparator>or</FieldSeparator>

        <LoginForm />

        <AuthParagraph className="text-center">
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </AuthParagraph>
      </CardContent>
    </Card>
  )
}
