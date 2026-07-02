import { APP_NAME } from './constants'

export function logError(message: string, ...details: Array<unknown>) {
  console.error(`[${APP_NAME}] ${message}`, ...details)
}

export function logWarning(message: string, ...details: Array<unknown>) {
  console.warn(`[${APP_NAME}] ${message}`, ...details)
}
