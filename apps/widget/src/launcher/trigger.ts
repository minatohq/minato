import type {
  WidgetTriggerButtonConfig,
  WidgetTriggerButtonContentIcon,
  WidgetTriggerContainerConfig,
  WidgetTriggerOptions,
} from '../types'

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'
const SYSTEM_FONT_FAMILY = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
const TRIGGER_ROOT_ID = 'widget'

function createTriggerIcon(content: WidgetTriggerButtonContentIcon): SVGSVGElement {
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

function createContainerStyles(container: WidgetTriggerContainerConfig): string {
  return [
    `position: ${container.styles.position};`,
    container.styles.top ? `top: ${container.styles.top};` : '',
    container.styles.right ? `right: ${container.styles.right};` : '',
    container.styles.bottom ? `bottom: ${container.styles.bottom};` : '',
    container.styles.left ? `left: ${container.styles.left};` : '',
    `z-index: ${container.styles.zIndex};`,
  ]
    .filter(Boolean)
    .join('\n')
}

function createButtonContentStyles(content: WidgetTriggerButtonConfig['content']): string {
  if (content.type !== 'text') {
    return ''
  }

  return [
    `color: ${content.styles.color};`,
    `font-family: ${SYSTEM_FONT_FAMILY};`,
    `font-size: ${content.styles.fontSize};`,
    `font-weight: ${content.styles.fontWeight};`,
  ].join('\n')
}

function createTriggerStyles(options: WidgetTriggerOptions): HTMLStyleElement {
  const style = document.createElement('style')
  const buttonStyles = options.button.styles

  style.textContent = `
:host {
  all: initial !important;
  display: block !important;
}

.widget-trigger {
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  ${createContainerStyles(options.container)}
}

.widget-trigger-btn {
  appearance: none;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: ${buttonStyles.padding};
  min-width: ${buttonStyles.size};
  height: ${buttonStyles.size};
  background: ${buttonStyles.background};
  border: ${buttonStyles.border};
  border-radius: ${buttonStyles.borderRadius};
  box-shadow: ${buttonStyles.boxShadow};
  cursor: pointer;
  ${createButtonContentStyles(options.button.content)}
}

.widget-trigger-btn:hover {
  background: ${buttonStyles.hover.background};
}

.widget-trigger-btn:focus-visible {
  outline: ${buttonStyles.focus.outline};
  outline-offset: ${buttonStyles.focus.outlineOffset};
}

.widget-trigger-btn svg {
  display: block;
  flex-shrink: 0;
}
`

  return style
}

export function renderWidgetTrigger(options: WidgetTriggerOptions, onClick: () => void) {
  if (document.getElementById(TRIGGER_ROOT_ID) || !HTMLElement.prototype.attachShadow) {
    return
  }

  const content = options.button.content

  const root = document.createElement('div')
  root.id = TRIGGER_ROOT_ID

  const button = document.createElement('button')
  button.className = 'widget-trigger-btn'
  button.type = 'button'

  if (content.type === 'text') {
    button.textContent = content.label
  }

  if (content.type === 'icon') {
    button.setAttribute('aria-label', content.ariaLabel)
    button.append(createTriggerIcon(content))
  }

  button.addEventListener('click', onClick)

  const container = document.createElement('div')
  container.className = 'widget-trigger'
  container.append(button)

  const shadowRoot = root.attachShadow({
    mode: 'open',
  })

  shadowRoot.append(createTriggerStyles(options), container)
  document.body.append(root)
}
