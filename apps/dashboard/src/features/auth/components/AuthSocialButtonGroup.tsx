import { captureException } from '@sentry/tanstackstart-react'
import { ClientOnly, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import IconBrandGoogle from '@/assets/icons/icon-brand-google.svg?react'
import IconBrandMicrosoft from '@/assets/icons/icon-brand-microsoft.svg?react'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { authClient } from '@/features/auth/client'
import { AuthLastUsedBadge } from '@/features/auth/components/AuthLastUsedBadge'
import { cn } from '@/lib/utils'
import type { SocialProvider } from 'better-auth'

type SupportedProvider = Extract<SocialProvider, 'google' | 'microsoft'>

const socialProviders = [
  {
    provider: 'google',
    label: 'Google',
    Icon: IconBrandGoogle,
  },
  {
    provider: 'microsoft',
    label: 'Microsoft',
    Icon: IconBrandMicrosoft,
  },
] satisfies Array<{
  provider: SupportedProvider
  label: string
  Icon: React.ComponentType
}>

interface Props extends React.ComponentProps<'div'> {
  mode: 'login' | 'signup'
}

export function AuthSocialButtonGroup({ className, mode }: Props) {
  const { redirect } = useSearch({ from: '/(auth)/_layout' })

  const [isLocked, setIsLocked] = useState(false)
  const [providerError, setProviderError] = useState<string>()

  const buttonText = mode === 'login' ? 'Sign in' : 'Sign up'

  async function handleSocialAuth(provider: SupportedProvider) {
    if (isLocked) {
      return
    }

    setIsLocked(true)
    setProviderError(undefined)

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: redirect ?? '/',
        requestSignUp: mode === 'signup',
      })

      if (error) {
        throw new Error(error.message)
      }
    } catch (error: unknown) {
      captureException(error)

      setIsLocked(false)
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
        {socialProviders.map(({ provider, label, Icon }) => (
          <Button
            key={provider}
            className="relative"
            type="button"
            variant="outline"
            disabled={isLocked}
            onClick={() => handleSocialAuth(provider)}
          >
            <Icon />
            {buttonText} with {label}
            {mode === 'login' && (
              <ClientOnly fallback={null}>
                <AuthLastUsedBadge method={provider} />
              </ClientOnly>
            )}
          </Button>
        ))}
      </div>
    </>
  )
}
