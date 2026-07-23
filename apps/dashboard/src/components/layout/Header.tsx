import { UserProfile } from '@/components/layout/UserProfile'
import { Logo } from '@/components/Logo'
import { cn } from '@/lib/utils'

export function Header({ className }: React.ComponentProps<'header'>) {
  return (
    <header className={cn('border-b', className)}>
      <div className="flex h-12 items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-3">
          <Logo />
        </div>

        <div className="flex items-center gap-3">
          <UserProfile />
        </div>
      </div>
    </header>
  )
}
