import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/')({
  component: Home,
})

function Home() {
  return <h1>Hello, Minato!</h1>
}
