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
import { emailSchema, passwordSchema } from '@/lib/auth/schemas'

const formSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export function SignUpForm() {
  const id = useId()
  const navigate = useNavigate()

  const [submitError, setSubmitError] = useState<string>()

  const form = useForm({
    formId: 'sign-up',
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

        const { error } = await authClient.signUp.email({
          name: '',
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

        <form.Field
          name="password"
          children={(field) => (
            <Field data-invalid={!field.state.meta.isValid}>
              <FieldLabel htmlFor={`${id}-password`}>Password</FieldLabel>
              <Input
                id={`${id}-password`}
                name={field.name}
                type="password"
                autoComplete="new-password"
                value={field.state.value}
                aria-invalid={!field.state.meta.isValid}
                aria-describedby={!field.state.meta.isValid ? `${id}-password-error` : undefined}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
              />
              <FieldError id={`${id}-password-error`} errors={field.state.meta.errors} />
            </Field>
          )}
        />
      </FieldGroup>

      <form.Subscribe
        selector={(state) => state.isSubmitting}
        children={(isSubmitting) => (
          <Button type="submit" isLoading={isSubmitting}>
            Continue
          </Button>
        )}
      />
    </AuthForm>
  )
}
