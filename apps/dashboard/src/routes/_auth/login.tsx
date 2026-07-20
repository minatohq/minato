import { createFileRoute, Link } from '@tanstack/react-router'
import { APP_NAME } from '@repo/constants/app'
import { FieldSeparator } from '@/components/ui/Field'
import { AuthCard } from '@/features/auth/components/AuthCard'
import { AuthParagraph } from '@/features/auth/components/AuthParagraph'
import { AuthSocialButtonGroup } from '@/features/auth/components/AuthSocialButtonGroup'
import { LoginForm } from '@/features/auth/components/forms/LoginForm'
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
