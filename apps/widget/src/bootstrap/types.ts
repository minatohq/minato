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

export interface WidgetInitOptions {
  projectId: string
}

export interface WidgetLauncherController {
  show: () => void
  hide: () => void
}
