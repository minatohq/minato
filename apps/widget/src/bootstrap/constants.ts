import type { RuntimeStateKey } from './types'

export const APP_NAME = 'Feedy'

export const RUNTIME_STATE_KEY = `__${APP_NAME.toLowerCase()}RuntimeState` as RuntimeStateKey
