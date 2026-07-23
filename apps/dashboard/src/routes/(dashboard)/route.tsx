import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/sidebar/Sidebar'

export const Route = createFileRoute('/(dashboard)')({
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <div className="grid min-h-svh grid-rows-[auto_1fr]">
      <Header className="sticky" />
      <div className="grid h-full grid-cols-[auto_1fr]">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  )
}
