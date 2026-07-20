import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import { useId } from 'react'
import { Button } from '@/components/ui/Button'
import { Field, FieldError, FieldLabel } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

// oxfmt-ignore
const {
  fieldContext,
  formContext,
  useFieldContext,
  useFormContext,
} = createFormHookContexts()

export const { useAppForm: useAuthForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    InputField: AuthFormInputField,
  },
  formComponents: {
    SubmitButton: AuthFormSubmitButton,
  },
})

export function AuthForm({ className, ...props }: React.ComponentProps<'form'>) {
  return <form className={cn('flex flex-col gap-6', className)} {...props} />
}

export function AuthFormInputField({
  label,
  labelAction,
  ...props
}: Omit<
  React.ComponentProps<typeof Input>,
  'id' | 'name' | 'value' | 'aria-invalid' | 'aria-describedby' | 'onBlur' | 'onChange'
> & {
  label: React.ReactNode
  labelAction?: React.ReactNode
}) {
  const id = useId()
  const field = useFieldContext<string>()

  const errorId = `${id}-error`
  const isInvalid = !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      {labelAction ? (
        <div className="flex items-center gap-2">
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          {labelAction}
        </div>
      ) : (
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
      )}

      <Input
        id={id}
        name={field.name}
        value={field.state.value}
        aria-invalid={isInvalid}
        aria-describedby={isInvalid ? errorId : undefined}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
        {...props}
      />
      <FieldError id={errorId} errors={field.state.meta.errors} />
    </Field>
  )
}

export function AuthFormSubmitButton(
  props: Omit<React.ComponentProps<typeof Button>, 'type' | 'isLoading'>
) {
  const form = useFormContext()

  return (
    <form.Subscribe
      selector={(state) => state.isSubmitting}
      children={(isSubmitting) => <Button type="submit" isLoading={isSubmitting} {...props} />}
    />
  )
}
