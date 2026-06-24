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

export type WidgetOnCommand = ['on', WidgetEventName, WidgetEventHandler]

export type WidgetPublicCommand = WidgetVoidCommand | WidgetOnCommand

export type WidgetQueuedCommand =
  | WidgetVoidCommand
  | ['on', WidgetEventSubscriptionId, WidgetEventName, WidgetEventHandler]
  | ['off', WidgetEventSubscriptionId]

export type WidgetEventName = 'open' | 'close'
export type WidgetEventHandler = () => void
export type WidgetEventUnsubscribe = () => void

export type WidgetEventSubscriptionId = string

export interface WidgetEventSubscription {
  eventName: WidgetEventName
  handler: WidgetEventHandler
}

export interface WidgetInitOptions {
  projectId: string
}

export interface WidgetLauncherController {
  show: () => void
  hide: () => void
}
