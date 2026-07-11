import type { APP_NAME } from './constants'

export enum WidgetCommand {
  Init = 'init',
  OpenPopup = 'openPopup',
  ClosePopup = 'closePopup',
  ShowLauncher = 'showLauncher',
  HideLauncher = 'hideLauncher',
  Destroy = 'destroy',
  On = 'on',
}

export enum WidgetEvent {
  Ready = 'ready',
  PopupOpened = 'popupOpened',
  PopupClosed = 'popupClosed',
  LauncherShown = 'launcherShown',
  LauncherHidden = 'launcherHidden',
}

export enum WidgetTarget {
  Popup = 'popup',
}

export type RuntimeStateKey = `__${Lowercase<typeof APP_NAME>}RuntimeState`

export interface WidgetApi {
  (...args: WidgetOnCommand): WidgetEventUnsubscribe
  (...args: WidgetVoidCommand): void
  q?: Array<WidgetQueuedCommand>
  subscriptionCount?: number
}

export type WidgetVoidCommand =
  | [`${WidgetCommand.Init}`, WidgetInitOptions]
  | [`${WidgetCommand.OpenPopup}`]
  | [`${WidgetCommand.ClosePopup}`]
  | [`${WidgetCommand.ShowLauncher}`]
  | [`${WidgetCommand.HideLauncher}`]
  | [`${WidgetCommand.Destroy}`]

export type WidgetOnCommand = [`${WidgetCommand.On}`, WidgetEventName, WidgetEventHandler]

export type WidgetPublicCommand = WidgetVoidCommand | WidgetOnCommand

export type WidgetQueuedCommand =
  | WidgetVoidCommand
  | [`${WidgetCommand.On}`, WidgetEventSubscriptionId, WidgetEventName, WidgetEventHandler]
  | ['off', WidgetEventSubscriptionId]

export type WidgetEventName = `${WidgetEvent}`
export type WidgetEventHandler = () => void
export type WidgetEventUnsubscribe = () => void

export type WidgetEventSubscriptionId = string

export interface WidgetEventSubscription {
  eventName: WidgetEventName
  handler: WidgetEventHandler
}

export interface WidgetInitOptions {
  projectId?: string
}
