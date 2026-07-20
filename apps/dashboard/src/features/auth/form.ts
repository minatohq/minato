import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import { AuthFormInputField, AuthFormSubmitButton } from '@/features/auth/components/AuthForm'

// oxfmt-ignore
export const {
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
