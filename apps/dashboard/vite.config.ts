import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig, loadEnv } from 'vite-plus'
import { clientEnvSchema, envKeys, serverEnvSchema } from './src/env/schema.ts'
import type { PluginOption } from 'vite-plus'

export default defineConfig(({ mode }) => {
  // Validate environment variables
  const loadedEnv = loadEnv(mode, import.meta.dirname, envKeys)
  const runtimeEnv = Object.fromEntries(envKeys.map((key) => [key, loadedEnv[key]]))
  const serverEnv = serverEnvSchema.parse(runtimeEnv)
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
      // TEMP: Remove the cast once Nitro and Vite+ resolve to compatible shared Vite types
      ...(nitro({
        routeRules: {
          '/api/**': {
            proxy: `${serverEnv.API_PROXY_TARGET}/api/**`,
          },
        },
      }) as unknown as Array<PluginOption>),
      viteReact(), // React plugin must come after TanStack Start plugin
      tailwindcss(),
    ],
  }
})
