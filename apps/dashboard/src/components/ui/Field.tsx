import { cva } from 'class-variance-authority'
import { Label } from '@/components/ui/Label'
import { Separator } from '@/components/ui/Separator'
import { cn } from '@/lib/utils'
import type { VariantProps } from 'class-variance-authority'

export function FieldSet({ className, ...props }: React.ComponentProps<'fieldset'>) {
  return (
    <fieldset
      className={cn(
        'flex flex-col gap-6 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3',
        className
      )}
      data-slot="field-set"
      {...props}
    />
  )
}

export function FieldLegend({
  className,
  variant = 'legend',
  ...props
}: React.ComponentProps<'legend'> & { variant?: 'legend' | 'label' }) {
  return (
    <legend
      className={cn(
        'mb-3 font-medium data-[variant=label]:text-sm data-[variant=legend]:text-base',
        className
      )}
      data-slot="field-legend"
      data-variant={variant}
      {...props}
    />
  )
}

export function FieldGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'group/field-group @container/field-group flex w-full flex-col gap-4 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4',
        className
      )}
      data-slot="field-group"
      {...props}
    />
  )
}

const fieldVariants = cva('group/field flex w-full gap-2 data-[invalid=true]:text-destructive', {
  variants: {
    orientation: {
      vertical: 'flex-col *:w-full [&>.sr-only]:w-auto',
      horizontal:
        'flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
      responsive:
        'flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
})

export function Field({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      className={cn(fieldVariants({ orientation }), className)}
      role="group"
      data-slot="field"
      data-orientation={orientation}
      {...props}
    />
  )
}

export function FieldContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('group/field-content flex flex-1 flex-col gap-1 leading-snug', className)}
      data-slot="field-content"
      {...props}
    />
  )
}

export function FieldLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  return (
    <Label
      className={cn(
        'group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50 has-data-checked:bg-input/30 has-[>[data-slot=field]]:rounded-2xl has-[>[data-slot=field]]:border *:data-[slot=field]:p-4',
        'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col',
        '[&>a]:underline [&>a]:underline-offset-4 [&>a]:transition [&>a:hover]:text-primary',
        className
      )}
      data-slot="field-label"
      {...props}
    />
  )
}

export function FieldTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex w-fit items-center gap-2 text-sm font-medium group-data-[disabled=true]/field:opacity-50',
        className
      )}
      data-slot="field-label"
      {...props}
    />
  )
}

export function FieldDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'text-left text-sm leading-normal font-normal text-muted-foreground group-has-data-horizontal/field:text-balance [[data-variant=legend]+&]:-mt-1.5',
        'last:mt-0 nth-last-2:-mt-1',
        '[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary',
        className
      )}
      data-slot="field-description"
      {...props}
    />
  )
}

export function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  children?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2',
        className
      )}
      data-slot="field-separator"
      data-content={!!children}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span
          className="relative mx-auto block w-fit bg-background px-2 text-muted-foreground"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  )
}

export function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<'div'> & {
  errors?: Array<{ message?: string } | undefined>
}) {
  let content = children

  if (!content && errors?.length) {
    const uniqueErrors = [...new Map(errors.map((error) => [error?.message, error])).values()]

    if (uniqueErrors?.length == 1) {
      content = uniqueErrors[0]?.message
    } else {
      content = (
        <ul className="ml-4 flex list-disc flex-col gap-1">
          {uniqueErrors.map(
            (error, index) => error?.message && <li key={index}>{error.message}</li>
          )}
        </ul>
      )
    }
  }

  if (!content) {
    return null
  }

  return (
    <div
      className={cn('text-sm font-normal text-destructive', className)}
      role="alert"
      data-slot="field-error"
      {...props}
    >
      {content}
    </div>
  )
}
