import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite-plus'
import { clientEnvSchema, envKeys, serverEnvSchema } from './src/env/schema.ts'

export default defineConfig(({ mode }) => {
  // Validate environment variables
  const loadedEnv = loadEnv(mode, import.meta.dirname, envKeys)
  const runtimeEnv = Object.fromEntries(envKeys.map((key) => [key, loadedEnv[key]]))
  serverEnvSchema.parse(runtimeEnv)
  clientEnvSchema.parse(runtimeEnv)

  return {
    server: {
      port: 3000,
    },
    resolve: {
      tsconfigPaths: true,
    },
    plugins: [
      devtools(),
      tanstackStart(),
      viteReact(), // React plugin must come after TanStack Start plugin
      tailwindcss(),
    ],
  }
})
