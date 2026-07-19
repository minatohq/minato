import { cn } from '@/lib/utils'

export function AuthForm({ className, ...props }: React.ComponentProps<'form'>) {
  return <form className={cn('flex flex-col gap-6', className)} {...props} />
}
