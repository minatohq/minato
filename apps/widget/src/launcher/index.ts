import type {
  WidgetLauncherButtonConfig,
  WidgetLauncherButtonContentIcon,
  WidgetLauncherButtonStyles,
  WidgetLauncherContainerConfig,
  WidgetLauncherOptions,
} from '../types'
import type { WidgetLauncherController } from '../bootstrap/types'

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

function createHostStyles(): string {
  return [`all: initial!important;`, `display: block!important;`].filter(Boolean).join('\n')
}

function createContainerStyles(container: WidgetLauncherContainerConfig): string {
  return [
    `box-sizing: border-box;`,
    `position: ${container.styles.position};`,
    container.styles.top ? `top: ${container.styles.top};` : '',
    container.styles.right ? `right: ${container.styles.right};` : '',
    container.styles.bottom ? `bottom: ${container.styles.bottom};` : '',
    container.styles.left ? `left: ${container.styles.left};` : '',
    `z-index: ${container.styles.zIndex};`,
    `-webkit-font-smoothing: antialiased;`,
    `-moz-osx-font-smoothing: grayscale;`,
  ]
    .filter(Boolean)
    .join('\n')
}

function createButtonContentStyles(
  buttonStyles: WidgetLauncherButtonStyles,
  content: WidgetLauncherButtonConfig['content']
): string {
  if (content.type !== 'text') {
    return ''
  }

  return [
    `appearance: none;`,
    `display: flex;`,
    `align-items: center;`,
    `justify-content: center;`,
    `margin: 0;`,
    `padding: ${buttonStyles.padding};`,
    `min-width: ${buttonStyles.size};`,
    `height: ${buttonStyles.size};`,
    `background: ${buttonStyles.background};`,
    `border: ${buttonStyles.border};`,
    `border-radius: ${buttonStyles.borderRadius};`,
    `box-shadow: ${buttonStyles.boxShadow};`,
    `cursor: pointer;`,
    `color: ${content.styles.color};`,
    `font-family: ${SYSTEM_FONT_FAMILY};`,
    `font-size: ${content.styles.fontSize};`,
    `font-weight: ${content.styles.fontWeight};`,
  ]
    .filter(Boolean)
    .join('\n')
}

function createLauncherStyles(options: WidgetLauncherOptions): HTMLStyleElement {
  const style = document.createElement('style')
  const buttonStyles = options.button.styles

  style.textContent = `
:host {${createHostStyles()}}

.widget-launcher {${createContainerStyles(options.container)}}

.widget-launcher-btn {${createButtonContentStyles(options.button.styles, options.button.content)}}

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

export function renderWidgetLauncher(
  options: WidgetLauncherOptions,
  onClick: () => void
): WidgetLauncherController | undefined {
  const existingRoot = document.getElementById(LAUNCHER_ROOT_ID)

  if (existingRoot) {
    return {
      show: () => {
        existingRoot.hidden = false
      },
      hide: () => {
        existingRoot.hidden = true
      },
    }
  }

  if (!HTMLElement.prototype.attachShadow) {
    return
  }

  const content = options.button.content

  const root = document.createElement('div')
  root.id = LAUNCHER_ROOT_ID

  const button = document.createElement('button')
  button.className = 'widget-launcher-btn'
  button.type = 'button'

  if (content.type === 'text') {
    button.textContent = content.label
  }

  if (content.type === 'icon') {
    button.setAttribute('aria-label', content.ariaLabel)
    button.append(createLauncherIcon(content))
  }

  button.addEventListener('click', onClick)

  const container = document.createElement('div')
  container.className = 'widget-launcher'
  container.append(button)

  const shadowRoot = root.attachShadow({
    mode: 'open',
  })

  shadowRoot.append(createLauncherStyles(options), container)
  document.body.append(root)

  return {
    show: () => {
      root.hidden = false
    },
    hide: () => {
      root.hidden = true
    },
  }
}
