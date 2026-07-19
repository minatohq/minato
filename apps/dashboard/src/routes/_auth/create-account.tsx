import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { AuthForm } from '@/components/auth/AuthForm'
import { AuthParagraph } from '@/components/auth/AuthParagraph'
import { AuthSocialButtonGroup } from '@/components/auth/AuthSocialButtonGroup'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Field, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'

const termsOfServiceUrl = new URL('/terms', import.meta.env.VITE_WEBSITE_BASE_URL).toString()
const privacyPolicyUrl = new URL('/privacy', import.meta.env.VITE_WEBSITE_BASE_URL).toString()

export const Route = createFileRoute('/_auth/create-account')({
  component: RouteComponent,
})

function RouteComponent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <>
      <Card>
        <CardHeader className="text-center">
          <CardTitle>
            <h1>Create your account</h1>
          </CardTitle>
          <CardDescription>Start collecting feedback in just a few minutes.</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6">
          <AuthSocialButtonGroup mode="signup" />

          <FieldSeparator>or continue with email</FieldSeparator>

          <AuthForm>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="alex@acme.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </Field>
            </FieldGroup>

            <Button type="submit">Create account</Button>
          </AuthForm>

          <AuthParagraph className="text-center">
            Already have an account? <a href="#">Sign in</a>
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
