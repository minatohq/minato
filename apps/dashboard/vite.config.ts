import babel from '@rolldown/plugin-babel'
import { sentryTanstackStart } from '@sentry/tanstackstart-react/vite'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import svgr from 'vite-plugin-svgr'
import { defineConfig, loadEnv } from 'vite-plus'
import { clientEnvSchema, envKeys, serverEnvSchema } from './src/lib/env/schema.ts'
import type { PluginOption } from 'vite-plus'

export default defineConfig(({ mode }) => {
  // Validate environment variables
  const loadedEnv = loadEnv(mode, import.meta.dirname, envKeys)
  const runtimeEnv = Object.fromEntries(envKeys.map((key) => [key, loadedEnv[key]]))
  const serverEnv = serverEnvSchema.parse(runtimeEnv)
  clientEnvSchema.parse(runtimeEnv)

  return {
    server: {
      port: 3001,
      strictPort: true,
    },
    resolve: {
      tsconfigPaths: true,
    },
    plugins: [
      devtools(),
      tanstackStart(),
      react(), // React plugin must come after TanStack Start plugin
      babel({ presets: [reactCompilerPreset()] }),
      svgr(),
      tailwindcss(),

      // TEMP: Remove the cast once Nitro and Vite+ resolve to compatible shared Vite types
      ...(nitro({
        devProxy: {
          '/api/**': {
            target: serverEnv.API_PROXY_TARGET,
            changeOrigin: true,
          },
        },
        routeRules: {
          '/api/**': {
            proxy: `${serverEnv.API_PROXY_TARGET}/api/**`,
          },
        },
      }) as unknown as Array<PluginOption>),

      // Sentry must be the last plugin
      sentryTanstackStart({
        org: serverEnv.SENTRY_ORG_NAME,
        project: serverEnv.SENTRY_DASHBOARD_PROJECT_NAME,
        authToken: serverEnv.SENTRY_AUTH_TOKEN,
        tunnelRoute: true,
      }),
    ],
  }
})
