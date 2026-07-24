import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useId, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Field, FieldError, FieldLabel } from '@/components/ui/Field'
import { Input } from '@/components/ui/Input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/InputGroup'
import { useFieldContext, useFormContext } from '@/features/auth/form'
import { cn } from '@/lib/utils'

export function AuthForm({ className, ...props }: React.ComponentProps<'form'>) {
  return <form className={cn('flex flex-col gap-6', className)} {...props} />
}

export function AuthFormInputField({
  label,
  labelAction,
  type,
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

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const errorId = `${id}-error`
  const isInvalid = !field.state.meta.isValid

  const inputProps = {
    id,
    name: field.name,
    value: field.state.value,
    'aria-invalid': isInvalid,
    'aria-describedby': isInvalid ? errorId : undefined,
    onBlur: field.handleBlur,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
      field.handleChange(event.target.value),
    ...props,
  }

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

      {type === 'password' ? (
        <InputGroup>
          <InputGroupInput type={isPasswordVisible ? 'text' : 'password'} {...inputProps} />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
              onClick={() => setIsPasswordVisible((isVisible) => !isVisible)}
            >
              {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      ) : (
        <Input type={type} {...inputProps} />
      )}
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
