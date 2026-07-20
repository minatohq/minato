import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeftIcon, MailCheckIcon } from 'lucide-react'
import { useState } from 'react'
import { ForgotPasswordForm } from '@/components/forms/ForgotPasswordForm'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { createPageTitle } from '@/lib/metadata'

export const Route = createFileRoute('/_auth/forgot-password')({
  head: () => ({
    meta: [{ title: createPageTitle('Forgot password') }],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const [emailSent, setEmailSent] = useState<string>()

  if (emailSent) {
    return <SentState email={emailSent} />
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>
          <h1>Forgot your password?</h1>
        </CardTitle>

        <CardDescription className="text-balance">
          Enter your email and we&apos;ll send you a password reset link.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-6">
        <ForgotPasswordForm onSent={setEmailSent} />

        <Button variant="ghost" render={<Link to="/login" />}>
          <ArrowLeftIcon />
          Back to login
        </Button>
      </CardContent>
    </Card>
  )
}

function SentState({ email }: { email: string }) {
  return (
    <Card>
      <MailCheckIcon className="mx-auto size-12 text-green-600" />

      <CardHeader className="text-center">
        <CardTitle>
          <h1>Check your email</h1>
        </CardTitle>

        <CardDescription className="text-balance">
          If an account exists for <span className="text-foreground">{email}</span>, you&apos;ll
          receive a password reset link shortly.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Button className="w-full" variant="ghost" render={<Link to="/login" />}>
          <ArrowLeftIcon />
          Back to login
        </Button>
      </CardContent>
    </Card>
  )
}
