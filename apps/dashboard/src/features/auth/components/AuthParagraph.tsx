import { cn } from '@/lib/utils'

export function AuthParagraph({ className, children }: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'text-sm leading-normal text-muted-foreground',
        '[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary',
        className
      )}
    >
      {children}
    </p>
  )
}
