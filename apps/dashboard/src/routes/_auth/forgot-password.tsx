import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeftIcon, MailCheckIcon } from 'lucide-react'
import { useState } from 'react'
import { AuthCard } from '@/components/auth/AuthCard'
import { ForgotPasswordForm } from '@/components/forms/ForgotPasswordForm'
import { Button } from '@/components/ui/Button'
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
    <AuthCard
      title="Forgot your password?"
      description="Enter your email and we'll send you a password reset link."
    >
      <ForgotPasswordForm onSent={setEmailSent} />

      <Button variant="ghost" render={<Link to="/login" />}>
        <ArrowLeftIcon />
        Back to login
      </Button>
    </AuthCard>
  )
}

function SentState({ email }: { email: string }) {
  return (
    <AuthCard
      title="Check your email"
      description={
        <>
          If an account exists for <strong className="font-medium text-foreground">{email}</strong>,
          you&apos;ll receive a password reset link shortly.
        </>
      }
      media={<MailCheckIcon className="text-green-600" />}
    >
      <Button className="w-full" variant="ghost" nativeButton={false} render={<Link to="/login" />}>
        <ArrowLeftIcon />
        Back to login
      </Button>
    </AuthCard>
  )
}
