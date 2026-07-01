import { isBrowserEnvironment, waitForDocumentInteractive } from './browser'
import { loadConfig } from './config'
import { createRootContainer } from './dom'
import { logError } from './helpers'
import { renderWidgetLauncher } from '../launcher'
import { APP_NAME, RUNTIME_STATE_KEY } from './constants'
import type {
  WidgetApi,
  WidgetEventSubscription,
  WidgetEventSubscriptionId,
  WidgetEventName,
  WidgetInitOptions,
  WidgetLauncherController,
  WidgetPublicCommand,
  WidgetQueuedCommand,
} from './types'

interface BootstrapWindow extends Window {
  [RUNTIME_STATE_KEY]?: RuntimeState
}

interface RuntimeState {
  commandChain: Promise<void>
  eventSubscriptions: Map<WidgetEventSubscriptionId, WidgetEventSubscription>
  launcher?: WidgetLauncherController
  subscriptionCount: number
  isWidgetOpen: boolean
  isInitialized: boolean
}

function getBootstrapWindow() {
  return window as BootstrapWindow
}

function getState() {
  const bootstrapWindow = getBootstrapWindow()

  bootstrapWindow[RUNTIME_STATE_KEY] ??= {
    commandChain: Promise.resolve(),
    eventSubscriptions: new Map(),
    subscriptionCount: 0,
    isWidgetOpen: false,
    isInitialized: false,
  }

  return bootstrapWindow[RUNTIME_STATE_KEY]
}

async function init(state: RuntimeState, options: WidgetInitOptions) {
  if (!options.projectId) {
    logError('Missing required "projectId" initialization option')
    return
  }

  const config = await loadConfig(options.projectId)

  if (!config?.launcher.enabled) {
    return
  }

  // We wait for `interactive` instead of `DOMContentLoaded` so the widget
  // can be rendered as early as possible.
  await waitForDocumentInteractive()

  if (!createRootContainer()) {
    return
  }

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

function createSubscriptionId(state: RuntimeState) {
  state.subscriptionCount += 1

  return `subscription_${state.subscriptionCount}`
}

function on(
  state: RuntimeState,
  subscriptionId: WidgetEventSubscriptionId,
  eventName: WidgetEventName,
  handler: WidgetEventSubscription['handler']
) {
  state.eventSubscriptions.set(subscriptionId, {
    eventName,
    handler,
  })
}

function off(state: RuntimeState, subscriptionId: WidgetEventSubscriptionId) {
  state.eventSubscriptions.delete(subscriptionId)
}

function emitEvent(state: RuntimeState, eventName: WidgetEventName) {
  const subscriptions = [...state.eventSubscriptions.values()].filter(
    (subscription) => subscription.eventName === eventName
  )

  if (import.meta.env.DEV) {
    console.log(
      `[${APP_NAME}] Emitting "${eventName}" event with ${subscriptions.length} subscription(s)`
    )
  }

  for (const { handler } of subscriptions) {
    try {
      handler()
    } catch (error: unknown) {
      logError(`Error in "${eventName}" event handler:`, error)
    }
  }
}

async function executeCommand(state: RuntimeState, command: WidgetQueuedCommand) {
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
      on(state, command[1], command[2], command[3])
      break

    case 'off':
      off(state, command[1])
      break
  }
}

function getQueuedCommands(widgetApi: WidgetApi | undefined) {
  return widgetApi?.q ?? []
}

function getSubscriptionCount(widgetApi: WidgetApi | undefined) {
  return widgetApi?.subscriptionCount ?? 0
}

function enqueueCommand(state: RuntimeState, command: WidgetQueuedCommand) {
  state.commandChain = state.commandChain.then(() => executeCommand(state, command)).catch(() => {})
}

function createWidgetApi(state: RuntimeState): WidgetApi {
  return ((...args: WidgetPublicCommand | ['off', WidgetEventSubscriptionId]) => {
    if (args[0] === 'on') {
      const subscriptionId = createSubscriptionId(state)

      enqueueCommand(state, ['on', subscriptionId, args[1], args[2]])

      return () => {
        enqueueCommand(state, ['off', subscriptionId])
      }
    }

    enqueueCommand(state, args)

    return undefined
  }) as WidgetApi
}

function start() {
  const state = getState()

  if (state.isInitialized) {
    return
  }

  // Capture queued command calls and subscriptions count before replacing the public widget API.
  const queuedCommands = getQueuedCommands(window[APP_NAME])
  state.subscriptionCount = getSubscriptionCount(window[APP_NAME])

  window[APP_NAME] = createWidgetApi(state)

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
