export interface WidgetConfig {
  launcher: WidgetLauncherOptions
}

export interface WidgetLauncherOptions {
  enabled: boolean
  container: WidgetLauncherContainerConfig
  button: WidgetLauncherButtonConfig
}

export interface WidgetLauncherContainerConfig {
  styles: {
    position: string
    top?: string
    right?: string
    bottom?: string
    left?: string
    zIndex: string
  }
}

export interface WidgetLauncherButtonConfig {
  styles: WidgetLauncherButtonStyles
  content: WidgetLauncherButtonContent
}

export interface WidgetLauncherButtonStyles {
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

export type WidgetLauncherButtonContent =
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

export type WidgetLauncherButtonContentIcon = Extract<WidgetLauncherButtonContent, { type: 'icon' }>
