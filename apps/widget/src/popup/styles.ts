export function getPopupStyles() {
  return `
*, *::before, *::after {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.popup {
  padding: 0.75rem;
  height: 100%;
  border: 1px solid #ccc;
}

.popup-heading {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
}

.popup-description {
  margin: 0 0 1rem;
}

.popup-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.popup-textarea {
  min-height: 6rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font: inherit;
  resize: vertical;
}

.popup-submit {
  padding: 0.5rem 0.75rem;
  color: inherit;
  background: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 4px;
  font: inherit;
  cursor: pointer;
}
`
}
