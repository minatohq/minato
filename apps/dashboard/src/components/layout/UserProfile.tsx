import { useNavigate } from '@tanstack/react-router'
import { LogOutIcon, MonitorIcon, MoonIcon, SunIcon, SunMoonIcon, UserIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { Skeleton } from '@/components/ui/Skeleton'
import { toast } from '@/components/ui/Toast'
import { authClient, useSession } from '@/features/auth/client'
import { useTheme } from '@/features/theme'
import { Theme } from '@/features/theme/types'

export function UserProfile() {
  const navigate = useNavigate()

  const { data, error, isPending } = useSession()
  const { theme, setTheme } = useTheme()

  async function handleSignOut() {
    try {
      const { error } = await authClient.signOut()

      if (error) {
        throw error
      }
    } catch {
      toast.add({
        type: 'error',
        title: 'Failed to sign you out',
        description: 'Please try again.',
      })

      return
    }

    await navigate({
      to: '/login',
      replace: true,
    })
  }

  if (isPending) {
    return <Skeleton className="size-6 rounded-full" />
  }

  if (!data || error) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button className="size-auto rounded-full border-0 p-0" variant="ghost" />}
      >
        <Avatar size="sm">
          {data.user.image && (
            <AvatarImage src={data.user.image} alt={data.user.name ?? data.user.email} />
          )}
          <AvatarFallback>
            <UserIcon />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-3xs" align="end" side="bottom" sideOffset={4}>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="py-1.5 text-xs">
            <span className="block truncate">{data.user.email}</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <SunMoonIcon />
              Theme
            </DropdownMenuSubTrigger>

            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={theme}
                onValueChange={(value) => setTheme(value as Theme)}
              >
                <DropdownMenuRadioItem value={Theme.Light}>
                  <SunIcon />
                  Light
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={Theme.Dark}>
                  <MoonIcon />
                  Dark
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={Theme.System}>
                  <MonitorIcon />
                  System
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleSignOut}>
            <LogOutIcon />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
