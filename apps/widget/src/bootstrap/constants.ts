import type { RuntimeStateKey } from './types'

export const APP_NAME = 'Minato'
export const APP_NAME_LOWERCASE = APP_NAME.toLowerCase() as Lowercase<typeof APP_NAME>

export const ROOT_CONTAINER_ID = `${APP_NAME_LOWERCASE}-container`
export const ROOT_STYLES_ID = `${APP_NAME_LOWERCASE}-styles`
export const POPUP_FRAME_CLASS = `${APP_NAME_LOWERCASE}-popup-frame`
export const POPUP_FRAME_TITLE = `${APP_NAME} popup`
export const LAUNCHER_FRAME_CLASS = `${APP_NAME_LOWERCASE}-launcher-frame`
export const LAUNCHER_FRAME_TITLE = `${APP_NAME} launcher`
export const POPUP_TRIGGER_ATTRIBUTE = `data-${APP_NAME_LOWERCASE}-popup-trigger`

export const SUBSCRIPTION_ID_PREFIX = 's_'

export const RUNTIME_STATE_KEY = `__${APP_NAME_LOWERCASE}RuntimeState` as RuntimeStateKey
