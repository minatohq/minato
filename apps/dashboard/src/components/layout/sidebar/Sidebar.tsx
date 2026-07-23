import { Link } from '@tanstack/react-router'
import { HouseIcon, MessageCircleMoreIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Sidebar({ className }: React.ComponentProps<'aside'>) {
  return (
    <aside
      className={cn('flex h-full w-3xs flex-col gap-3 border-r py-3 text-foreground', className)}
    >
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuLink to="/">
              <HouseIcon />
              Home
            </SidebarMenuLink>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Collect</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuLink to="/feedback">
              <MessageCircleMoreIcon />
              Feedback
            </SidebarMenuLink>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </aside>
  )
}

function SidebarGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex w-full flex-col px-2', className)} {...props} />
}

function SidebarGroupLabel({ className, children, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex h-8 w-full items-center px-2 text-xs font-medium text-foreground/70',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function SidebarMenu({ className, ...props }: React.ComponentProps<'ul'>) {
  return <ul className={cn('flex w-full flex-col gap-1', className)} {...props} />
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<'li'>) {
  return <li className={cn('relative', className)} {...props} />
}

function SidebarMenuLink({ className, children, ...props }: React.ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        'flex h-8 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-muted-foreground outline-hidden',
        'hover:bg-foreground/5 hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        'data-[status="active"]:bg-foreground/10 data-[status="active"]:text-foreground',
        className
      )}
      {...props}
    >
      {children}
    </Link>
  )
}
