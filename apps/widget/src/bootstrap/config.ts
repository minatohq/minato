import { env } from '../env'
import { logError } from './helpers'
import type { WidgetConfig } from '@repo/types/widget'

export async function loadConfig(projectId: string) {
  try {
    const response = await fetch(`${env.VITE_API_BASE_URL}/widget/config/${projectId}`)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    return (await response.json()) as WidgetConfig
  } catch (error: unknown) {
    logError('Failed to load widget config', error)
  }
}
