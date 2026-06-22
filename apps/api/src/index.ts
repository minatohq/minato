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
    trigger: {
      enabled: true,
      container: {
        styles: {
          position: 'fixed',
          right: '24px',
          bottom: '0',
          zIndex: '2147483000',
        },
      },
      button: {
        styles: {
          size: '42px',
          padding: '0 16px',
          background: '#111827',
          border: '1px solid #000',
          borderRadius: '12px 12px 0 0',
          boxShadow: '0 10px 24px rgba(17, 24, 39, 0.24)',
          hover: {
            background: '#1f2937',
          },
          focus: {
            outline: '3px solid #60a5fa',
            outlineOffset: '3px',
          },
        },
        content: {
          type: 'text',
          label: 'Feedback',
          styles: {
            color: '#fff',
            fontWeight: '500',
            fontSize: '16px',
          },
        },
      },
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
