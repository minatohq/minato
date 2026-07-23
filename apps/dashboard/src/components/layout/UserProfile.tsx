import { useNavigate } from '@tanstack/react-router'
import { LogOutIcon, UserIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { Skeleton } from '@/components/ui/Skeleton'
import { authClient, useSession } from '@/features/auth/client'

export function UserProfile() {
  const navigate = useNavigate()
  const { data, error, isPending } = useSession()

  function handleSignOut() {
    void authClient.signOut({
      fetchOptions: {
        onSuccess: async () => {
          await navigate({
            to: '/login',
            replace: true,
          })
        },
      },
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
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOutIcon />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
