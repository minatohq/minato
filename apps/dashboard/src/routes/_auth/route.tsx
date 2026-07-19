import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="grid w-full max-w-sm gap-6">
        <div className="text-center">
          <a className="font-heading text-2xl font-black" href="#">
            Minato
          </a>
        </div>

        <Outlet />
      </div>
    </main>
  )
}
