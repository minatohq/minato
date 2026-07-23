import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/sidebar/Sidebar'
import { getSession } from '@/features/auth/functions'

export const Route = createFileRoute('/(dashboard)')({
  beforeLoad: async ({ location }) => {
    const session = await getSession()

    if (!session) {
      throw redirect({
        to: '/login',
        search: {
          reauth: true,
          redirect: location.href,
        },
        replace: true,
      })
    }

    return { session }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <div className="grid min-h-svh grid-rows-[auto_1fr]">
      <Header className="sticky top-0 z-(--z-index-header)" />
      <div className="grid h-full grid-cols-[auto_1fr]">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  )
}
