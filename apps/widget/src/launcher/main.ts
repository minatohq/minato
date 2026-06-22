import { renderWidgetTrigger } from './trigger'
import type { WidgetOptions } from '../types'

const WIDGET_LAUNCHER_ATTRIBUTE = 'data-widget-launcher'
const WIDGET_LAUNCHER_SELECTOR = `[${WIDGET_LAUNCHER_ATTRIBUTE}]`

async function loadConfig(_appId: string) {
  const response = await fetch('http://localhost:3001')

  if (!response.ok) {
    throw new Error(`Failed to load widget config: ${response.status}`)
  }

  return response.json() as Promise<WidgetOptions>
}

function openWidget() {
  console.log('Clicked')
}

function attachEventHandler() {
  const launcherWindow = window as Window & { __widgetLauncherHandlerAttached?: boolean }

  if (launcherWindow.__widgetLauncherHandlerAttached) {
    return
  }

  launcherWindow.__widgetLauncherHandlerAttached = true

  document.addEventListener('click', (event) => {
    const target = event.target

    if (!(target instanceof Element) || !target.closest(WIDGET_LAUNCHER_SELECTOR)) {
      return
    }

    openWidget()
  })
}

async function init() {
  const widget = window.Widget

  if (!widget) {
    return
  }

  const options = await loadConfig(widget.appId)

  attachEventHandler()

  if (options.trigger.enabled) {
    renderWidgetTrigger(options.trigger, openWidget)
  }
}

async function start() {
  try {
    await init()
  } catch {}
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => void start(), {
    once: true,
  })
} else {
  void start()
}
