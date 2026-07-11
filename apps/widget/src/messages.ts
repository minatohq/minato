import { APP_NAME_LOWERCASE } from './bootstrap/constants'
import type { WidgetLauncherOptions } from '@repo/types/widget'

export const WIDGET_MESSAGE_SOURCE = APP_NAME_LOWERCASE

export enum LauncherMessageType {
  Ready = 'launcher:ready',
  Init = 'launcher:init',
  Click = 'launcher:click',
  State = 'launcher:state',
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

export interface LauncherClickMessage {
  source: typeof WIDGET_MESSAGE_SOURCE
  type: LauncherMessageType.Click
}

export interface LauncherStateMessage {
  source: typeof WIDGET_MESSAGE_SOURCE
  type: LauncherMessageType.State
  payload: {
    isOpen: boolean
  }
}

export type LauncherMessage =
  | LauncherReadyMessage
  | LauncherInitMessage
  | LauncherClickMessage
  | LauncherStateMessage

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

export function createLauncherClickMessage(): LauncherClickMessage {
  return {
    source: WIDGET_MESSAGE_SOURCE,
    type: LauncherMessageType.Click,
  }
}

export function createLauncherStateMessage(isOpen: boolean): LauncherStateMessage {
  return {
    source: WIDGET_MESSAGE_SOURCE,
    type: LauncherMessageType.State,
    payload: { isOpen },
  }
}
