import { ROOT_CONTAINER_ID, ROOT_STYLES_ID } from './constants'
import { logError } from './helpers'
import { rootStyles } from './styles'

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
