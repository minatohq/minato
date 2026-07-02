import type { APP_NAME } from './constants'

export enum WidgetCommand {
  Init = 'init',
  Open = 'open',
  Close = 'close',
  ShowLauncher = 'showLauncher',
  HideLauncher = 'hideLauncher',
  Destroy = 'destroy',
  On = 'on',
}

export enum WidgetEvent {
  Ready = 'ready',
  Open = 'open',
  Close = 'close',
  ShowLauncher = 'showLauncher',
  HideLauncher = 'hideLauncher',
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
  | [`${WidgetCommand.Open}`]
  | [`${WidgetCommand.Close}`]
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
