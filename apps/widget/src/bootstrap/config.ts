import type { WidgetConfig } from '../types'

export async function loadConfig(_projectId: string) {
  const response = await fetch('http://localhost:3001')

  if (!response.ok) {
    throw new Error(`Failed to load widget config: ${response.status}`)
  }

  return response.json() as Promise<WidgetConfig>
}
