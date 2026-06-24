Bootstrap → Launcher → Widget

Bootstrap = script customer embeds
Launcher = floating button/icon (only if enabled)
Widget = actual widget window

Public API = window.Feedy

```html
<script>
  window.Feedy = window.Feedy || function (...args) {
    window.Feedy.q = window.Feedy.q || []
    window.Feedy.subscriptionCount = window.Feedy.subscriptionCount || 0

    if (args[0] === 'on') {
      const subscriptionId = `subscription_${++window.Feedy.subscriptionCount}`

      window.Feedy.q.push(['on', subscriptionId, args[1], args[2]])

      return function unsubscribe() {
        window.Feedy('off', subscriptionId)
      }
    }

    window.Feedy.q.push(args)
  }

  Feedy('init', {
    projectId: 'project_123',
  })
</script>
```

Supported commands:

- `Feedy('init', config)`
- `Feedy('open')`
- `Feedy('close')`
- `Feedy('showLauncher')`
- `Feedy('hideLauncher')`

Event API:

- `const unsubscribe = Feedy('on', 'open', handler)`
- `const unsubscribe = Feedy('on', 'close', handler)`

Call the returned `unsubscribe` function to remove that listener.
