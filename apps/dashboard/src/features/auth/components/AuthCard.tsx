import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardMedia,
  CardTitle,
} from '@/components/ui/Card'

interface Props {
  title: React.ReactNode
  description: React.ReactNode
  children: React.ReactNode
  media?: React.ReactNode
}

export function AuthCard({ title, description, children, media }: Props) {
  return (
    <Card>
      <CardHeader className="text-center">
        {media && <CardMedia>{media}</CardMedia>}

        <CardTitle>
          <h1>{title}</h1>
        </CardTitle>

        <CardDescription className="text-balance">{description}</CardDescription>
      </CardHeader>

      <CardContent className="grid gap-6">{children}</CardContent>
    </Card>
  )
}
