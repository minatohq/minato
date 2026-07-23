import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { Logo } from '@/components/Logo'
import { hasSessionCookie } from '@/features/auth/functions'
import { env } from '@/lib/env'

export const Route = createFileRoute('/(auth)/_layout')({
  validateSearch: z.object({
    reauth: z.boolean().optional().catch(false),
  }),
  beforeLoad: async ({ search }) => {
    if (!search.reauth && (await hasSessionCookie())) {
      throw redirect({
        to: '/',
        replace: true,
      })
    }
  },
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="grid w-full max-w-sm gap-6">
        <div className="text-center">
          <a href={env.VITE_WEBSITE_BASE_URL}>
            <Logo />
          </a>
        </div>

        <Outlet />
      </div>
    </main>
  )
}
