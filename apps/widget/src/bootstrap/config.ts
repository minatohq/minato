import { logError } from './helpers'
import type { WidgetConfig } from '../types'

export async function loadConfig(_projectId: string) {
  try {
    const response = await fetch('http://localhost:3001')

    if (!response.ok) {
      logError(`Failed to load widget config: ${response.status}`)
      return
    }

    return (await response.json()) as WidgetConfig
  } catch (error: unknown) {
    logError('Failed to load widget config:', error)
  }
}
