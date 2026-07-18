import { defineConfig, loadEnv } from 'vite-plus'
import { clientEnvSchema } from './src/env/schema.ts'

export default defineConfig(({ mode }) => {
  // Validate environment variables
  const runtimeEnv = loadEnv(mode, import.meta.dirname)
  clientEnvSchema.parse(runtimeEnv)

  return {
    server: {
      port: 3001,
      strictPort: true,
    },
  }
})
