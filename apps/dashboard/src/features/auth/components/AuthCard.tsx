import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

interface Props {
  title: React.ReactNode
  description: React.ReactNode
  children: React.ReactNode
}

export function AuthCard({ title, description, children }: Props) {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>
          <h1>{title}</h1>
        </CardTitle>

        <CardDescription className="text-balance">{description}</CardDescription>
      </CardHeader>

      <CardContent className="grid gap-6">{children}</CardContent>
    </Card>
  )
}
