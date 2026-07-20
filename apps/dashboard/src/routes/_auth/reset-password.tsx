import { createFileRoute, Link } from '@tanstack/react-router'
import { BASE_ERROR_CODES } from 'better-auth'
import { ArrowLeftIcon } from 'lucide-react'
import { z } from 'zod'
import { ResetPasswordForm } from '@/components/forms/ResetPasswordForm'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { createPageTitle } from '@/lib/metadata'

const searchSchema = z.object({
  token: z.string().optional(),
  error: z.string().optional(),
})

export const Route = createFileRoute('/_auth/reset-password')({
  head: () => ({
    meta: [{ title: createPageTitle('Reset password') }],
  }),
  validateSearch: searchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  const { token, error } = Route.useSearch()

  if (error === BASE_ERROR_CODES.INVALID_TOKEN.code || !token) {
    return <InvalidTokenState />
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>
          <h1>Reset your password</h1>
        </CardTitle>

        <CardDescription className="text-balance">
          Enter a new password for your account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ResetPasswordForm token={token} />
      </CardContent>
    </Card>
  )
}

function InvalidTokenState() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>
          <h1>Reset link expired</h1>
        </CardTitle>

        <CardDescription className="text-balance">
          This password reset link is invalid or has expired.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-6">
        <Alert variant="destructive">
          <AlertDescription>Request a new link to reset your password.</AlertDescription>
        </Alert>

        <Button variant="ghost" nativeButton={false} render={<Link to="/forgot-password" />}>
          <ArrowLeftIcon />
          Request a new link
        </Button>
      </CardContent>
    </Card>
  )
}
