import { revalidateLogic } from '@tanstack/react-form'
import { ClientOnly, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { FieldGroup } from '@/components/ui/Field'
import { authClient } from '@/features/auth/client'
import { AuthForm } from '@/features/auth/components/AuthForm'
import { AuthLastUsedBadge } from '@/features/auth/components/AuthLastUsedBadge'
import { useAuthForm } from '@/features/auth/form'
import { emailSchema, passwordSchema } from '@/features/auth/schema'

const formSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export function LoginForm() {
  const navigate = useNavigate()

  const [submitError, setSubmitError] = useState<string>()

  const form = useAuthForm({
    formId: 'login',
    defaultValues: {
      email: '',
      password: '',
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: formSchema,
    },
    listeners: {
      onChange: () => setSubmitError(undefined),
    },
    onSubmit: async ({ value }) => {
      setSubmitError(undefined)

      try {
        const parsedValue = formSchema.parse(value)

        const { error } = await authClient.signIn.email({
          email: parsedValue.email,
          password: parsedValue.password,
        })

        if (error) {
          throw new Error(error.message)
        }

        await navigate({
          to: '/',
          replace: true,
        })
      } catch (error: unknown) {
        setSubmitError(
          error instanceof Error ? error.message : 'An unknown error occurred. Please try again.'
        )
      }
    },
  })

  return (
    <AuthForm
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
    >
      {submitError && (
        <Alert variant="destructive">
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <FieldGroup>
        <form.AppField
          name="email"
          children={(field) => (
            <field.InputField
              label="Email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="alex@acme.com"
            />
          )}
        />

        <form.AppField
          name="password"
          children={(field) => (
            <field.InputField
              label="Password"
              type="password"
              autoComplete="current-password"
              labelAction={
                <Link
                  className="ml-auto text-xs text-muted-foreground underline underline-offset-2 hover:text-primary"
                  to="/forgot-password"
                >
                  Forgot password?
                </Link>
              }
            />
          )}
        />
      </FieldGroup>

      <form.AppForm>
        <div className="relative">
          <form.SubmitButton className="w-full">Continue</form.SubmitButton>
          <ClientOnly fallback={null}>
            <AuthLastUsedBadge method="email" />
          </ClientOnly>
        </div>
      </form.AppForm>
    </AuthForm>
  )
}
