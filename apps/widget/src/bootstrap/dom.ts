import { ROOT_CONTAINER_ID, ROOT_STYLES_ID } from './constants'
import { logError } from './helpers'
import { rootStyles } from './styles'

export interface FrameOptions {
  scriptSrc: string
  title: string
  className: string
}

export interface FrameController {
  readonly element: HTMLIFrameElement
  mount: () => void
  destroy: () => void
}

export function isBrowserEnvironment() {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

export function waitForDocumentInteractive() {
  if (document.readyState !== 'loading') {
    return Promise.resolve()
  }

  return new Promise<void>((resolve) => {
    const handleReadyStateChange = () => {
      if (document.readyState === 'loading') {
        return
      }

      document.removeEventListener('readystatechange', handleReadyStateChange)
      resolve()
    }

    document.addEventListener('readystatechange', handleReadyStateChange)
  })
}

export function createRootContainer(): HTMLDivElement | null {
  const hasContainerIdCollision = document.getElementById(ROOT_CONTAINER_ID) !== null
  const hasStylesIdCollision = document.getElementById(ROOT_STYLES_ID) !== null

  if (hasContainerIdCollision) {
    logError(`Unable to create root container: "${ROOT_CONTAINER_ID}" is already in use`)
  }

  if (hasStylesIdCollision) {
    logError(`Unable to create styles container: "${ROOT_STYLES_ID}" is already in use`)
  }

  if (hasContainerIdCollision || hasStylesIdCollision) {
    return null
  }

  const container = document.createElement('div')
  const styles = document.createElement('style')

  container.id = ROOT_CONTAINER_ID
  styles.id = ROOT_STYLES_ID
  styles.textContent = rootStyles

  document.body.append(styles, container)

  return container
}

export function getRootContainer() {
  return document.getElementById(ROOT_CONTAINER_ID) as HTMLDivElement | null
}

export function destroyRootContainer() {
  document.getElementById(ROOT_CONTAINER_ID)?.remove()
  document.getElementById(ROOT_STYLES_ID)?.remove()
}

export function createFrame(options: FrameOptions): FrameController {
  let initializedDocument: Document | undefined

  const element = document.createElement('iframe')
  element.title = options.title
  element.className = options.className

  return {
    element,

    mount: () => {
      const container = getRootContainer()

      if (!container) {
        logError(`Unable to mount iframe: "${ROOT_CONTAINER_ID}" was not found`)
        return
      }

      container.append(element)

      const frameDocument = element.contentDocument

      if (!frameDocument) {
        logError('Unable to access iframe document')
        return
      }

      if (frameDocument === initializedDocument) {
        return
      }

      const script = frameDocument.createElement('script')
      script.src = options.scriptSrc

      // Vite dev mode uses module script
      if (import.meta.env.DEV) {
        script.type = 'module'
      }

      frameDocument.body.append(script)
      initializedDocument = frameDocument
    },

    destroy: () => {
      element.remove()
      initializedDocument = undefined
    },
  }
}
