import { captureException } from '@sentry/tanstackstart-react'
import { QueryClient } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { useEffect } from 'react'
import { routeTree } from './routeTree.gen'
import type { ErrorComponentProps } from '@tanstack/react-router'

export interface RouterContext {
  queryClient: QueryClient
}

function GlobalErrorComponent({ error }: ErrorComponentProps) {
  useEffect(() => {
    captureException(error)
  }, [error])

  return <h1>Something went wrong</h1>
}

function GlobalNotFoundComponent() {
  return <h1>Page not found</h1>
}

export function getRouter() {
  const queryClient = new QueryClient()

  const router = createRouter({
    routeTree,
    context: {
      queryClient,
    },
    defaultPreload: 'intent',
    defaultErrorComponent: GlobalErrorComponent,
    defaultNotFoundComponent: GlobalNotFoundComponent,
    scrollRestoration: true,
  })

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
