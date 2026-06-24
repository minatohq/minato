import { isBrowserEnvironment, waitForDocumentInteractive } from './browser'
import { loadConfig } from './config'
import { renderWidgetLauncher } from './launcher'
import type {
  WidgetApi,
  WidgetCommand,
  WidgetEventHandler,
  WidgetEventName,
  WidgetInitOptions,
  WidgetLauncherController,
} from './types'

interface BootstrapWindow extends Window {
  __feedyRuntimeState?: RuntimeState
}

interface RuntimeState {
  commandChain: Promise<void>
  eventListeners: Map<WidgetEventName, Set<WidgetEventHandler>>
  launcher?: WidgetLauncherController
  isWidgetOpen: boolean
  isInitialized: boolean
}

function getBootstrapWindow() {
  return window as BootstrapWindow
}

function getState() {
  const bootstrapWindow = getBootstrapWindow()

  bootstrapWindow.__feedyRuntimeState ??= {
    commandChain: Promise.resolve(),
    eventListeners: new Map(),
    isWidgetOpen: false,
    isInitialized: false,
  }

  return bootstrapWindow.__feedyRuntimeState
}

async function init(state: RuntimeState, options: WidgetInitOptions) {
  const config = await loadConfig(options.projectId)

  if (!config.launcher.enabled) {
    return
  }

  // We wait for `interactive` instead of `DOMContentLoaded` so the widget
  // can be rendered as early as possible.
  await waitForDocumentInteractive()

  state.launcher = renderWidgetLauncher(config.launcher, () => openWidget(state))
}

function openWidget(state: RuntimeState) {
  if (state.isWidgetOpen) {
    return
  }

  state.isWidgetOpen = true
  emitEvent(state, 'open')
}

function closeWidget(state: RuntimeState) {
  if (!state.isWidgetOpen) {
    return
  }

  state.isWidgetOpen = false
  emitEvent(state, 'close')
}

function showLauncher(state: RuntimeState) {
  state.launcher?.show()
}

function hideLauncher(state: RuntimeState) {
  state.launcher?.hide()
}

function on(state: RuntimeState, eventName: WidgetEventName, handler: WidgetEventHandler) {
  const eventListeners = state.eventListeners.get(eventName) ?? new Set()

  eventListeners.add(handler)
  state.eventListeners.set(eventName, eventListeners)
}

function emitEvent(state: RuntimeState, eventName: WidgetEventName) {
  for (const handler of state.eventListeners.get(eventName) ?? []) {
    handler()
  }
}

async function executeCommand(state: RuntimeState, command: WidgetCommand) {
  switch (command[0]) {
    case 'init':
      await init(state, command[1])
      break

    case 'open':
      openWidget(state)
      break

    case 'close':
      closeWidget(state)
      break

    case 'showLauncher':
      showLauncher(state)
      break

    case 'hideLauncher':
      hideLauncher(state)
      break

    case 'on':
      on(state, command[1], command[2])
      break
  }
}

function getQueuedCommands(widgetApi: WidgetApi | undefined) {
  return widgetApi?.q ?? []
}

function enqueueCommand(state: RuntimeState, command: WidgetCommand) {
  state.commandChain = state.commandChain.then(() => executeCommand(state, command)).catch(() => {})
}

function createWidgetApi(state: RuntimeState): WidgetApi {
  return (...args: WidgetCommand) => {
    enqueueCommand(state, args)
  }
}

function start() {
  const state = getState()

  if (state.isInitialized) {
    return
  }

  // Capture queued command calls before replacing `window.Feedy`
  const queuedCommands = getQueuedCommands(window.Feedy)

  window.Feedy = createWidgetApi(state)

  state.isInitialized = true

  for (const command of queuedCommands) {
    enqueueCommand(state, command)
  }
}

// Keeps the bootstrap safe to import from non-browser environments,
// such as SSR or npm package consumers.
if (isBrowserEnvironment()) {
  start()
}
