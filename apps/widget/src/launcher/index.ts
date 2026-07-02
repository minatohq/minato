import { loadConfig } from '../bootstrap/config'
import { getLauncherStyles } from './styles'
import type { WidgetLauncherOptions } from '../types'

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'
const LAUNCHER_ROOT_ID = 'feedy-launcher'
const LAUNCHER_ICON_PATH =
  'M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719'

function createLauncherIcon(): SVGSVGElement {
  const svg = document.createElementNS(SVG_NAMESPACE, 'svg')
  svg.setAttribute('xmlns', SVG_NAMESPACE)
  svg.setAttribute('width', '24')
  svg.setAttribute('height', '24')
  svg.setAttribute('viewBox', '0 0 24 24')
  svg.setAttribute('fill', 'none')
  svg.setAttribute('stroke', 'currentColor')
  svg.setAttribute('stroke-width', '2')
  svg.setAttribute('stroke-linecap', 'round')
  svg.setAttribute('stroke-linejoin', 'round')
  svg.setAttribute('aria-hidden', 'true')
  svg.setAttribute('focusable', 'false')

  const path = document.createElementNS(SVG_NAMESPACE, 'path')
  path.setAttribute('d', LAUNCHER_ICON_PATH)

  svg.append(path)

  return svg
}

function createLauncherStyles(options: WidgetLauncherOptions): HTMLStyleElement {
  const style = document.createElement('style')
  style.textContent = getLauncherStyles(options.color, options.iconColor)

  return style
}

export function renderLauncher(options: WidgetLauncherOptions) {
  if (document.getElementById(LAUNCHER_ROOT_ID)) {
    return
  }

  const root = document.createElement('div')
  const button = document.createElement('button')

  root.id = LAUNCHER_ROOT_ID
  button.className = 'widget-launcher-btn'
  button.type = 'button'
  button.setAttribute('aria-label', 'Open feedback widget')
  button.append(createLauncherIcon())

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
