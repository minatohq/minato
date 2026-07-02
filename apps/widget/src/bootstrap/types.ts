import type { APP_NAME } from './constants'

export type RuntimeStateKey = `__${Lowercase<typeof APP_NAME>}RuntimeState`

export interface WidgetApi {
  (...args: WidgetOnCommand): WidgetEventUnsubscribe
  (...args: WidgetVoidCommand): void
  q?: Array<WidgetQueuedCommand>
  subscriptionCount?: number
}

export type WidgetVoidCommand =
  | ['init', WidgetInitOptions]
  | ['open']
  | ['close']
  | ['showLauncher']
  | ['hideLauncher']
  | ['destroy']

export type WidgetOnCommand = ['on', WidgetEventName, WidgetEventHandler]

export type WidgetPublicCommand = WidgetVoidCommand | WidgetOnCommand

export type WidgetQueuedCommand =
  | WidgetVoidCommand
  | ['on', WidgetEventSubscriptionId, WidgetEventName, WidgetEventHandler]
  | ['off', WidgetEventSubscriptionId]

export type WidgetEventName = 'ready' | 'open' | 'close' | 'showLauncher' | 'hideLauncher'
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
