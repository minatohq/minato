import { createPopupCloseMessage } from '../messages'
import { getPopupStyles } from './styles'

const PARENT_ORIGIN = window.parent.location.origin

const container = document.createElement('div')
const heading = document.createElement('h1')
const description = document.createElement('p')
const closeButton = document.createElement('button')
const form = document.createElement('form')
const textarea = document.createElement('textarea')
const submitButton = document.createElement('button')

const style = document.createElement('style')
style.textContent = getPopupStyles()

container.className = 'popup'

heading.className = 'popup-heading'
heading.textContent = 'Your feedback'

description.className = 'popup-description'
description.textContent = 'Tell us what is on your mind.'

closeButton.className = 'popup-close'
closeButton.type = 'button'
closeButton.textContent = 'Close'
closeButton.addEventListener('click', () => {
  window.parent.postMessage(createPopupCloseMessage(), PARENT_ORIGIN)
})

form.className = 'popup-form'

textarea.className = 'popup-textarea'

submitButton.className = 'popup-submit'
submitButton.type = 'submit'
submitButton.textContent = 'Submit'

form.addEventListener('submit', (event) => {
  event.preventDefault()
})

form.append(textarea, submitButton)
container.append(heading, description, closeButton, form)

document.head.append(style)
document.body.append(container)
