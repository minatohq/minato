import { revalidateLogic } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { FieldGroup } from '@/components/ui/Field'
import { authClient } from '@/features/auth/client'
import { AuthForm } from '@/features/auth/components/AuthForm'
import { useAuthForm } from '@/features/auth/form'
import { passwordSchema } from '@/features/auth/schema'

const formSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine(({ newPassword, confirmPassword }) => newPassword === confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export function ResetPasswordForm({ token }: { token: string }) {
  const navigate = useNavigate()

  const [submitError, setSubmitError] = useState<string>()

  const form = useAuthForm({
    formId: 'reset-password',
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
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

        const { error } = await authClient.resetPassword({
          newPassword: parsedValue.newPassword,
          token,
        })

        if (error) {
          throw new Error(error.message)
        }

        await navigate({
          to: '/login',
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
          name="newPassword"
          children={(field) => (
            <field.InputField label="New password" type="password" autoComplete="new-password" />
          )}
        />

        <form.AppField
          name="confirmPassword"
          children={(field) => (
            <field.InputField
              label="Confirm password"
              type="password"
              autoComplete="new-password"
            />
          )}
        />
      </FieldGroup>

      <form.AppForm>
        <form.SubmitButton>Reset password</form.SubmitButton>
      </form.AppForm>
    </AuthForm>
  )
}
