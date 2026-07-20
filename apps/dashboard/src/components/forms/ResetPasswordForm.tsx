import { revalidateLogic, useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { useId, useState } from 'react'
import { z } from 'zod'
import { AuthForm } from '@/components/auth/AuthForm'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'
import { authClient } from '@/lib/auth/client'
import { passwordSchema } from '@/lib/auth/schemas'

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
  const id = useId()
  const navigate = useNavigate()

  const [submitError, setSubmitError] = useState<string>()

  const form = useForm({
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
        <form.Field
          name="newPassword"
          children={(field) => (
            <Field data-invalid={!field.state.meta.isValid}>
              <FieldLabel htmlFor={`${id}-new-password`}>New password</FieldLabel>
              <Input
                id={`${id}-new-password`}
                name={field.name}
                type="password"
                autoComplete="new-password"
                value={field.state.value}
                aria-invalid={!field.state.meta.isValid}
                aria-describedby={
                  !field.state.meta.isValid ? `${id}-new-password-error` : undefined
                }
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
              />
              <FieldError id={`${id}-new-password-error`} errors={field.state.meta.errors} />
            </Field>
          )}
        />

        <form.Field
          name="confirmPassword"
          children={(field) => (
            <Field data-invalid={!field.state.meta.isValid}>
              <FieldLabel htmlFor={`${id}-confirm-password`}>Confirm password</FieldLabel>
              <Input
                id={`${id}-confirm-password`}
                name={field.name}
                type="password"
                autoComplete="new-password"
                value={field.state.value}
                aria-invalid={!field.state.meta.isValid}
                aria-describedby={
                  !field.state.meta.isValid ? `${id}-confirm-password-error` : undefined
                }
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
              />
              <FieldError id={`${id}-confirm-password-error`} errors={field.state.meta.errors} />
            </Field>
          )}
        />
      </FieldGroup>

      <form.Subscribe
        selector={(state) => state.isSubmitting}
        children={(isSubmitting) => (
          <Button type="submit" isLoading={isSubmitting}>
            Reset password
          </Button>
        )}
      />
    </AuthForm>
  )
}
