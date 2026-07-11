import { APP_NAME, APP_NAME_LOWERCASE } from '@repo/constants/app'
import type { RuntimeStateKey } from './types'

export const ROOT_CONTAINER_ID = `${APP_NAME_LOWERCASE}-container`
export const ROOT_STYLES_ID = `${APP_NAME_LOWERCASE}-styles`
export const POPUP_FRAME_CLASS = `${APP_NAME_LOWERCASE}-popup-frame`
export const POPUP_FRAME_TITLE = `${APP_NAME} popup`
export const LAUNCHER_FRAME_CLASS = `${APP_NAME_LOWERCASE}-launcher-frame`
export const LAUNCHER_FRAME_TITLE = `${APP_NAME} launcher`

export const SUBSCRIPTION_ID_PREFIX = 's_'

export const RUNTIME_STATE_KEY = `__${APP_NAME_LOWERCASE}RuntimeState` as RuntimeStateKey
