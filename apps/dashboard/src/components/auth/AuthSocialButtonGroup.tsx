import { useState } from 'react'
import IconBrandGoogle from '@/assets/icons/icon-brand-google.svg?react'
import IconBrandMicrosoft from '@/assets/icons/icon-brand-microsoft.svg?react'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { authClient } from '@/lib/auth/client'
import { cn } from '@/lib/utils'
import type { SocialProvider } from 'better-auth'

interface Props extends React.ComponentProps<'div'> {
  mode: 'signin' | 'signup'
}

export function AuthSocialButtonGroup({ className, mode }: Props) {
  const [providerError, setProviderError] = useState<string>()

  const buttonText = mode === 'signin' ? 'Sign in' : 'Sign up'

  async function handleSocialAuth(provider: SocialProvider) {
    setProviderError(undefined)

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: '/',
        requestSignUp: mode === 'signup',
      })

      if (error) {
        throw new Error(error.message)
      }
    } catch (error: unknown) {
      setProviderError(
        error instanceof Error ? error.message : 'An unknown error occurred. Please try again.'
      )
    }
  }

  return (
    <>
      {providerError && (
        <Alert variant="destructive">
          <AlertDescription>{providerError}</AlertDescription>
        </Alert>
      )}

      <div className={cn('flex flex-col gap-2.5', className)}>
        <Button type="button" variant="outline" onClick={() => handleSocialAuth('google')}>
          <IconBrandGoogle />
          {buttonText} with Google
        </Button>

        <Button type="button" variant="outline" onClick={() => handleSocialAuth('microsoft')}>
          <IconBrandMicrosoft />
          {buttonText} with Microsoft
        </Button>
      </div>
    </>
  )
}
