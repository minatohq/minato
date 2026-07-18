import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { auth } from '#/auth'
import { env } from '#/env'

const app = new Hono()

app.use(
  '/widget/*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
    maxAge: 86_400,
    credentials: false,
  })
)

app.on(['GET', 'POST'], '/api/auth/*', (c) => {
  return auth.handler(c.req.raw)
})

app.get('/widget/config/:projectId', async (c) => {
  const _projectId = c.req.param('projectId')

  return c.json({
    launcher: {
      enabled: true,
      color: '#111827',
      iconColor: '#fff',
    },
  })
})

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  }
)
