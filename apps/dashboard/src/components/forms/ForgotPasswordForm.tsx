import { revalidateLogic, useForm } from '@tanstack/react-form'
import { useId, useState } from 'react'
import { z } from 'zod'
import { AuthForm } from '@/components/auth/AuthForm'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'
import { authClient } from '@/lib/auth/client'

const formSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').pipe(z.email('Enter a valid email address')),
})

interface Props {
  onSent: (email: string) => void
}

export function ForgotPasswordForm({ onSent }: Props) {
  const id = useId()

  const [submitError, setSubmitError] = useState<string>()

  const form = useForm({
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
          redirectTo: '/reset-password',
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
        <form.Field
          name="email"
          children={(field) => (
            <Field data-invalid={!field.state.meta.isValid}>
              <FieldLabel htmlFor={`${id}-email`}>Email</FieldLabel>
              <Input
                id={`${id}-email`}
                name={field.name}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="alex@acme.com"
                value={field.state.value}
                aria-invalid={!field.state.meta.isValid}
                aria-describedby={!field.state.meta.isValid ? `${id}-email-error` : undefined}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
              />
              <FieldError id={`${id}-email-error`} errors={field.state.meta.errors} />
            </Field>
          )}
        />
      </FieldGroup>

      <form.Subscribe
        selector={(state) => state.isSubmitting}
        children={(isSubmitting) => (
          <Button type="submit" isLoading={isSubmitting}>
            Send reset link
          </Button>
        )}
      />
    </AuthForm>
  )
}
