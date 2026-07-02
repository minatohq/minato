import { env } from '../env'
import { createLauncherInitMessage, LauncherMessageType, WIDGET_MESSAGE_SOURCE } from '../messages'
import { loadConfig } from './config'
import {
  APP_NAME,
  LAUNCHER_FRAME_CLASS,
  LAUNCHER_FRAME_TITLE,
  RUNTIME_STATE_KEY,
  SUBSCRIPTION_ID_PREFIX,
} from './constants'
import {
  createFrame,
  createRootContainer,
  destroyRootContainer,
  isBrowserEnvironment,
  waitForDocumentInteractive,
} from './dom'
import { logError, logWarning } from './helpers'
import { WidgetCommand, WidgetEvent } from './types'
import type { LauncherMessage } from '../messages'
import type { WidgetConfig } from '../types'
import type { FrameController } from './dom'
import type {
  WidgetApi,
  WidgetEventSubscription,
  WidgetEventSubscriptionId,
  WidgetEventName,
  WidgetInitOptions,
  WidgetPublicCommand,
  WidgetQueuedCommand,
} from './types'

interface BootstrapWindow extends Window {
  [RUNTIME_STATE_KEY]?: RuntimeState
}

interface RuntimeState {
  commandChain: Promise<void>
  config?: WidgetConfig
  eventSubscriptions: Map<WidgetEventSubscriptionId, WidgetEventSubscription>
  launcher?: FrameController
  subscriptionCount: number
  isBootstrapInitialized: boolean
  isReady: boolean
  isWidgetOpen: boolean
}

const supportedCommandNames = Object.values(WidgetCommand)
const supportedEventNames = Object.values(WidgetEvent)
const supportedCommands = supportedCommandNames.join(', ')
const supportedEvents = supportedEventNames.join(', ')

function getBootstrapWindow() {
  return window as BootstrapWindow
}

function getState() {
  const bootstrapWindow = getBootstrapWindow()

  bootstrapWindow[RUNTIME_STATE_KEY] ??= {
    commandChain: Promise.resolve(),
    eventSubscriptions: new Map(),
    subscriptionCount: 0,
    isBootstrapInitialized: false,
    isReady: false,
    isWidgetOpen: false,
  }

  return bootstrapWindow[RUNTIME_STATE_KEY]
}

async function init(state: RuntimeState, options: WidgetInitOptions) {
  if (state.isReady) {
    return
  }

  if (!options.projectId) {
    logError('Missing required "projectId" initialization option')
    return
  }

  const config = await loadConfig(options.projectId)

  if (!config) {
    return
  }

  state.config = config

  // We wait for `interactive` instead of `DOMContentLoaded` so the widget
  // can be rendered as early as possible.
  await waitForDocumentInteractive()

  if (!createRootContainer()) {
    return
  }

  if (config.launcher.enabled) {
    const launcher = createFrame({
      scriptSrc: env.VITE_LAUNCHER_URL,
      title: LAUNCHER_FRAME_TITLE,
      className: LAUNCHER_FRAME_CLASS,
    })

    state.launcher = launcher

    launcher.mount()
  }

  state.isReady = true
  emitEvent(state, WidgetEvent.Ready)
}

function openWidget(state: RuntimeState) {
  if (state.isWidgetOpen) {
    return
  }

  state.isWidgetOpen = true
  emitEvent(state, WidgetEvent.Open)
}

function closeWidget(state: RuntimeState) {
  if (!state.isWidgetOpen) {
    return
  }

  state.isWidgetOpen = false
  emitEvent(state, WidgetEvent.Close)
}

function showLauncher(state: RuntimeState) {
  if (!state.launcher || !state.launcher.element.hidden) {
    return
  }

  state.launcher.element.hidden = false
  emitEvent(state, WidgetEvent.ShowLauncher)
}

function hideLauncher(state: RuntimeState) {
  if (!state.launcher || state.launcher.element.hidden) {
    return
  }

  state.launcher.element.hidden = true
  emitEvent(state, WidgetEvent.HideLauncher)
}

function resetWidgetState(state: RuntimeState) {
  delete state.config
  delete state.launcher
  state.eventSubscriptions.clear()
  state.isWidgetOpen = false
  state.isReady = false
}

function destroy(state: RuntimeState) {
  if (!state.isReady) {
    logWarning('Ignoring "destroy" command: widget is not ready')
    return
  }

  state.launcher?.destroy()
  destroyRootContainer()
  resetWidgetState(state)
}

function createSubscriptionId(state: RuntimeState) {
  state.subscriptionCount += 1

  return `${SUBSCRIPTION_ID_PREFIX}${state.subscriptionCount}`
}

function invokeEventHandler(
  eventName: WidgetEventName,
  handler: WidgetEventSubscription['handler']
) {
  try {
    handler()
  } catch (error: unknown) {
    logError(`Error in "${eventName}" event handler:`, error)
  }
}

function on(
  state: RuntimeState,
  subscriptionId: WidgetEventSubscriptionId,
  eventName: unknown,
  handler: WidgetEventSubscription['handler']
) {
  if (!isWidgetEventName(eventName)) {
    logWarning(`Unrecognized event "${String(eventName)}". Supported events: ${supportedEvents}`)
    return
  }

  state.eventSubscriptions.set(subscriptionId, {
    eventName,
    handler,
  })

  if (eventName === WidgetEvent.Ready && state.isReady) {
    invokeEventHandler(eventName, handler)
  }
}

function isWidgetEventName(eventName: unknown): eventName is WidgetEventName {
  return supportedEventNames.some((supportedEventName) => supportedEventName === eventName)
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
    invokeEventHandler(eventName, handler)
  }
}

function handleLauncherMessage(state: RuntimeState, event: MessageEvent<LauncherMessage>) {
  const launcherWindow = state.launcher?.element.contentWindow

  if (
    !launcherWindow ||
    !state.config ||
    event.source !== launcherWindow ||
    event.origin !== window.location.origin ||
    event.data.source !== WIDGET_MESSAGE_SOURCE
  ) {
    return
  }

  if (event.data.type === LauncherMessageType.Ready) {
    launcherWindow.postMessage(createLauncherInitMessage(state.config.launcher), event.origin)
  }
}

async function executeCommand(state: RuntimeState, command: WidgetQueuedCommand) {
  const commandName = command[0]

  switch (commandName) {
    case WidgetCommand.Init:
      await init(state, command[1])
      break

    case WidgetCommand.Open:
      openWidget(state)
      break

    case WidgetCommand.Close:
      closeWidget(state)
      break

    case WidgetCommand.ShowLauncher:
      showLauncher(state)
      break

    case WidgetCommand.HideLauncher:
      hideLauncher(state)
      break

    case WidgetCommand.Destroy:
      destroy(state)
      break

    case WidgetCommand.On:
      on(state, command[1], command[2], command[3])
      break

    case 'off':
      off(state, command[1])
      break

    default:
      logWarning(
        `Unrecognized command "${String(commandName)}". Supported commands: ${supportedCommands}`
      )
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
    if (args[0] === WidgetCommand.On) {
      const subscriptionId = createSubscriptionId(state)

      enqueueCommand(state, [WidgetCommand.On, subscriptionId, args[1], args[2]])

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

  if (state.isBootstrapInitialized) {
    return
  }

  // Capture queued command calls and subscriptions count before replacing the public widget API.
  const queuedCommands = getQueuedCommands(window[APP_NAME])
  state.subscriptionCount = getSubscriptionCount(window[APP_NAME])

  window[APP_NAME] = createWidgetApi(state)
  window.addEventListener('message', (event) => handleLauncherMessage(state, event))

  state.isBootstrapInitialized = true

  for (const command of queuedCommands) {
    enqueueCommand(state, command)
  }
}

// Keeps the bootstrap safe to import from non-browser environments,
// such as SSR or npm package consumers.
if (isBrowserEnvironment()) {
  start()
}
