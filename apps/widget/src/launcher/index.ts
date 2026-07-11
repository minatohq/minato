import {
  createLauncherClickMessage,
  createLauncherReadyMessage,
  LauncherMessageType,
  WIDGET_MESSAGE_SOURCE,
} from '../messages'
import { getLauncherStyles } from './styles'
import type { WidgetLauncherOptions } from '@repo/types/widget'
import type { LauncherMessage } from '../messages'

const PARENT_ORIGIN = window.parent.location.origin

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'
const LAUNCHER_ROOT_ID = 'feedy-launcher'
const LAUNCHER_ICON_PATH =
  'M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719'
const CLOSE_ICON_PATHS = ['M18 6 6 18', 'm6 6 12 12']

let isWidgetOpen = false

function createLauncherIcon(paths: Array<string>): SVGSVGElement {
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

  for (const pathData of paths) {
    const path = document.createElementNS(SVG_NAMESPACE, 'path')
    path.setAttribute('d', pathData)
    svg.append(path)
  }

  return svg
}

function updateLauncherButton(button: HTMLButtonElement) {
  button.setAttribute('aria-label', isWidgetOpen ? 'Close widget' : 'Open widget')
  button.replaceChildren(createLauncherIcon(isWidgetOpen ? CLOSE_ICON_PATHS : [LAUNCHER_ICON_PATH]))
}

function createLauncherStyles(options: WidgetLauncherOptions): HTMLStyleElement {
  const style = document.createElement('style')
  style.textContent = getLauncherStyles(options.color, options.iconColor)

  return style
}

function renderLauncher(options: WidgetLauncherOptions) {
  if (document.getElementById(LAUNCHER_ROOT_ID)) {
    return
  }

  const root = document.createElement('div')
  const button = document.createElement('button')

  root.id = LAUNCHER_ROOT_ID
  button.className = 'widget-launcher-btn'
  button.type = 'button'
  updateLauncherButton(button)
  button.addEventListener('click', () => {
    window.parent.postMessage(createLauncherClickMessage(), PARENT_ORIGIN)
  })

  root.append(button)
  document.head.append(createLauncherStyles(options))
  document.body.append(root)
}

function handleMessage(event: MessageEvent<LauncherMessage>) {
  if (
    event.source !== window.parent ||
    event.origin !== PARENT_ORIGIN ||
    event.data.source !== WIDGET_MESSAGE_SOURCE
  ) {
    return
  }

  if (event.data.type === LauncherMessageType.Init) {
    renderLauncher(event.data.payload)
  }

  if (event.data.type === LauncherMessageType.State) {
    isWidgetOpen = event.data.payload.isOpen

    const button = document.querySelector<HTMLButtonElement>(`#${LAUNCHER_ROOT_ID} button`)

    if (button) {
      updateLauncherButton(button)
    }
  }
}

function start() {
  window.addEventListener('message', handleMessage)
  window.parent.postMessage(createLauncherReadyMessage(), PARENT_ORIGIN)
}

start()
