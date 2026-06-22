declare global {
  interface Window {
    Widget?: WidgetOptions
  }
}

export interface WidgetOptions {
  appId: string
  trigger: WidgetTriggerOptions
}

export interface WidgetTriggerOptions {
  enabled: boolean
  container: WidgetTriggerContainerConfig
  button: WidgetTriggerButtonConfig
}

export interface WidgetTriggerContainerConfig {
  styles: {
    position: string
    top?: string
    right?: string
    bottom?: string
    left?: string
    zIndex: string
  }
}

export interface WidgetTriggerButtonConfig {
  styles: WidgetTriggerButtonStyles
  content: WidgetTriggerButtonContent
}

export interface WidgetTriggerButtonStyles {
  size: string
  padding: string
  border: string
  borderRadius: string
  background: string
  boxShadow: string
  hover: {
    background: string
  }
  focus: {
    outline: string
    outlineOffset: string
  }
}

export type WidgetTriggerButtonContent =
  | {
      type: 'text'
      label: string
      styles: { color: string; fontSize: string; fontWeight: string }
    }
  | {
      type: 'icon'
      path: string
      ariaLabel: string
      styles: { width: string; height: string; fill: string }
    }

export type WidgetTriggerButtonContentIcon = Extract<WidgetTriggerButtonContent, { type: 'icon' }>
