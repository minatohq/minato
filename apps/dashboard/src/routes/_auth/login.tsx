import { createFileRoute, Link } from '@tanstack/react-router'
import { APP_NAME } from '@repo/constants/app'
import { AuthCard } from '@/components/auth/AuthCard'
import { AuthParagraph } from '@/components/auth/AuthParagraph'
import { AuthSocialButtonGroup } from '@/components/auth/AuthSocialButtonGroup'
import { LoginForm } from '@/components/auth/forms/LoginForm'
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
    <AuthCard title="Welcome back!" description={<>Log in to continue to {APP_NAME} dashboard.</>}>
      <AuthSocialButtonGroup mode="login" />

      <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">or</FieldSeparator>

      <LoginForm />

      <AuthParagraph className="text-center">
        Don&apos;t have an account? <Link to="/signup">Sign up</Link>
      </AuthParagraph>
    </AuthCard>
  )
}
