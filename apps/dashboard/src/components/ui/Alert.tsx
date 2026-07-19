import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import type { VariantProps } from 'class-variance-authority'

const alertVariants = cva(
  "group/alert relative grid w-full gap-0.5 rounded-lg border px-4 py-3 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2.5 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground',
        destructive:
          'bg-destructive/5 border-destructive/25 text-destructive *:data-[slot=alert-description]:text-destructive *:[svg]:text-current',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return (
    <div
      className={cn(alertVariants({ variant }), className)}
      data-slot="alert"
      role="alert"
      {...props}
    />
  )
}

export function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground',
        className
      )}
      data-slot="alert-title"
      {...props}
    />
  )
}

export function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'text-sm text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4',
        className
      )}
      data-slot="alert-description"
      {...props}
    />
  )
}

export function AlertAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('absolute top-2.5 right-3', className)}
      data-slot="alert-action"
      {...props}
    />
  )
}
