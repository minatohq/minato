import { APP_NAME_LOWERCASE } from './bootstrap/constants'
import type { WidgetLauncherOptions } from './types'

export const WIDGET_MESSAGE_SOURCE = APP_NAME_LOWERCASE

export enum LauncherMessageType {
  Ready = 'launcher:ready',
  Init = 'launcher:init',
}

export interface LauncherReadyMessage {
  source: typeof WIDGET_MESSAGE_SOURCE
  type: LauncherMessageType.Ready
}

export interface LauncherInitMessage {
  source: typeof WIDGET_MESSAGE_SOURCE
  type: LauncherMessageType.Init
  payload: WidgetLauncherOptions
}

export type LauncherMessage = LauncherReadyMessage | LauncherInitMessage

export function createLauncherReadyMessage(): LauncherReadyMessage {
  return {
    source: WIDGET_MESSAGE_SOURCE,
    type: LauncherMessageType.Ready,
  }
}

export function createLauncherInitMessage(payload: WidgetLauncherOptions): LauncherInitMessage {
  return {
    source: WIDGET_MESSAGE_SOURCE,
    type: LauncherMessageType.Init,
    payload,
  }
}
