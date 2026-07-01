import { LAUNCHER_FRAME_CLASS, ROOT_CONTAINER_ID } from './constants'

export const rootStyles = `
#${ROOT_CONTAINER_ID} {
  all: initial !important;
  display: block !important;
  width: 0 !important;
  height: 0 !important;
}

#${ROOT_CONTAINER_ID} .${LAUNCHER_FRAME_CLASS} {
  all: initial;
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 2147483647;
  display: block;
  width: 48px;
  height: 48px;
  border: 0;
}

#${ROOT_CONTAINER_ID} .${LAUNCHER_FRAME_CLASS}[hidden] {
  display: none !important;
}
`
