import styles from '@/styles.css?url'

import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import { Toaster } from '@/components/ui/Toast'
import { Devtools } from '@/devtools'
import { ThemeProvider } from '@/features/theme'
import type { RouterContext } from '@/router'

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Minato' },
    ],
    links: [{ rel: 'stylesheet', href: styles }],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>

      <body>
        <div id="root">
          <ThemeProvider>{children}</ThemeProvider>
          <Toaster />
        </div>

        <Scripts />
        <Devtools />
      </body>
    </html>
  )
}
