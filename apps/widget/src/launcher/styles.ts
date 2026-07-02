export function getLauncherStyles(color: string, iconColor: string) {
  return `
html, body {
  margin: 0;
  width: max-content;
  height: max-content;
  overflow: hidden;
  box-sizing: border-box;
}

.widget-launcher-btn {
  appearance: none;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  width: 48px;
  height: 48px;
  padding: 0;
  color: ${iconColor};
  background: ${color};
  border: 0;
  border-radius: 50%;
  cursor: pointer;
}

.widget-launcher-btn:hover {
  filter: brightness(0.9);
}

.widget-launcher-btn:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: -4px;
}

.widget-launcher-btn svg {
  display: block;
  flex-shrink: 0;
}
`
}
