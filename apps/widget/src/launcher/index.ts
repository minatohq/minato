import { loadConfig } from '../bootstrap/config'
import type {
  WidgetLauncherButtonConfig,
  WidgetLauncherButtonContentIcon,
  WidgetLauncherButtonStyles,
  WidgetLauncherOptions,
} from '../types'

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'
const SYSTEM_FONT_FAMILY = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
const LAUNCHER_ROOT_ID = 'feedy-launcher'

function createLauncherIcon(content: WidgetLauncherButtonContentIcon): SVGSVGElement {
  const svg = document.createElementNS(SVG_NAMESPACE, 'svg')
  svg.setAttribute('xmlns', SVG_NAMESPACE)
  svg.setAttribute('width', content.styles.width)
  svg.setAttribute('height', content.styles.height)
  svg.setAttribute('viewBox', '0 0 24 24')
  svg.setAttribute('aria-hidden', 'true')
  svg.setAttribute('focusable', 'false')

  const path = document.createElementNS(SVG_NAMESPACE, 'path')
  path.setAttribute('d', content.path)
  path.setAttribute('fill', content.styles.fill)

  svg.append(path)

  return svg
}

function createButtonContentStyles(
  buttonStyles: WidgetLauncherButtonStyles,
  content: WidgetLauncherButtonConfig['content']
): string {
  if (content.type !== 'text') {
    return ''
  }

  return [
    `padding: ${buttonStyles.padding};`,
    `color: ${content.styles.color};`,
    `font-family: ${SYSTEM_FONT_FAMILY};`,
    `font-size: ${content.styles.fontSize};`,
    `font-weight: ${content.styles.fontWeight};`,
  ].join('\n')
}

function createLauncherStyles(options: WidgetLauncherOptions): HTMLStyleElement {
  const style = document.createElement('style')
  const buttonStyles = options.button.styles

  style.textContent = `
html, body {
  margin: 0;
  width: max-content;
  height: max-content;
  overflow: hidden;
}

.widget-launcher-btn {
  box-sizing: border-box;
  appearance: none;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  min-width: ${buttonStyles.size};
  height: ${buttonStyles.size};
  background: ${buttonStyles.background};
  border: ${buttonStyles.border};
  border-radius: ${buttonStyles.borderRadius};
  box-shadow: ${buttonStyles.boxShadow};
  cursor: pointer;
  ${createButtonContentStyles(buttonStyles, options.button.content)}
}

.widget-launcher-btn:hover {
  background: ${buttonStyles.hover.background};
}

.widget-launcher-btn:focus-visible {
  outline: ${buttonStyles.focus.outline};
  outline-offset: ${buttonStyles.focus.outlineOffset};
}

.widget-launcher-btn svg {
  display: block;
  flex-shrink: 0;
}
`

  return style
}

export function renderLauncher(options: WidgetLauncherOptions) {
  if (document.getElementById(LAUNCHER_ROOT_ID)) {
    return
  }

  const content = options.button.content
  const root = document.createElement('div')
  const button = document.createElement('button')

  root.id = LAUNCHER_ROOT_ID
  button.className = 'widget-launcher-btn'
  button.type = 'button'

  if (content.type === 'text') {
    button.textContent = content.label
  } else {
    button.setAttribute('aria-label', content.ariaLabel)
    button.append(createLauncherIcon(content))
  }

  root.append(button)
  document.head.append(createLauncherStyles(options))
  document.body.append(root)
}

async function start() {
  const config = await loadConfig('')

  if (config?.launcher.enabled) {
    renderLauncher(config.launcher)
  }
}

void start()
