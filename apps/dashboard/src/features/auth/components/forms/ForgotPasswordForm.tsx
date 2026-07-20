import { revalidateLogic } from '@tanstack/react-form'
import { useState } from 'react'
import { z } from 'zod'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { FieldGroup } from '@/components/ui/Field'
import { env } from '@/env'
import { authClient } from '@/features/auth/client'
import { AuthForm, useAuthForm } from '@/features/auth/components/AuthForm'
import { emailSchema } from '@/features/auth/schemas'
import { Route as resetPasswordRoute } from '@/routes/_auth/reset-password'

const formSchema = z.object({
  email: emailSchema,
})

export function ForgotPasswordForm({ onSent }: { onSent: (email: string) => void }) {
  const [submitError, setSubmitError] = useState<string>()

  const form = useAuthForm({
    formId: 'forgot-password',
    defaultValues: {
      email: '',
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

        const { error } = await authClient.requestPasswordReset({
          email: parsedValue.email,
          redirectTo: new URL(resetPasswordRoute.to, env.VITE_DASHBOARD_BASE_URL).toString(),
        })

        if (error) {
          throw new Error(error.message)
        }

        onSent(parsedValue.email)
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
      </FieldGroup>

      <form.AppForm>
        <form.SubmitButton>Send reset link</form.SubmitButton>
      </form.AppForm>
    </AuthForm>
  )
}
