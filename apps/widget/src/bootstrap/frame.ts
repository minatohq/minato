import { ROOT_CONTAINER_ID } from './constants'
import { getRootContainer } from './dom'
import { logError } from './helpers'

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
