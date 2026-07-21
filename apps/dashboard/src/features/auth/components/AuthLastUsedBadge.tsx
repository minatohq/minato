import { Badge } from '@/components/ui/Badge'
import { authClient } from '@/features/auth/client'

export function AuthLastUsedBadge({ method }: { method: string }) {
  if (!authClient.isLastUsedLoginMethod(method)) {
    return null
  }

  return (
    <Badge className="absolute -top-2.5 -right-2.5 border-border" variant="secondary">
      Last used
    </Badge>
  )
}
