export interface WidgetApi {
  (...args: WidgetCommand): void
  q?: Array<WidgetCommand>
}

export type WidgetCommand =
  | ['init', WidgetInitOptions]
  | ['open']
  | ['close']
  | ['showLauncher']
  | ['hideLauncher']
  | ['on', WidgetEventName, WidgetEventHandler]

export type WidgetEventName = 'open' | 'close'

export type WidgetEventHandler = () => void

export interface WidgetInitOptions {
  projectId: string
}

export interface WidgetLauncherController {
  show: () => void
  hide: () => void
}
