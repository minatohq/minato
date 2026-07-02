import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use(
  '*',
  cors({
    origin: 'http://localhost:5173',
  })
)

app.get('/', (c) => {
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
    port: 3001,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  }
)
