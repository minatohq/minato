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
