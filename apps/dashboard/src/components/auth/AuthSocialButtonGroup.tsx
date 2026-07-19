import IconBrandGoogle from '@/assets/icons/icon-brand-google.svg?react'
import IconBrandMicrosoft from '@/assets/icons/icon-brand-microsoft.svg?react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface Props extends React.ComponentProps<'div'> {
  mode: 'signin' | 'signup'
}

export function AuthSocialButtonGroup({ className, mode }: Props) {
  const buttonText = mode === 'signin' ? 'Sign in' : 'Sign up'

  return (
    <div className={cn('flex flex-col gap-2.5', className)}>
      <Button type="button" variant="outline">
        <IconBrandGoogle />
        {buttonText} with Google
      </Button>

      <Button type="button" variant="outline">
        <IconBrandMicrosoft />
        {buttonText} with Microsoft
      </Button>
    </div>
  )
}
