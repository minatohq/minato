Bootstrap → Launcher → Widget

Bootstrap = script customer embeds
Launcher = floating button/icon (only if enabled)
Widget = actual widget window

Public API = window.Feedy

```html
<script>
  window.Feedy = window.Feedy || function (...args) {
    ;(window.Feedy.q = window.Feedy.q || []).push(args)
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

- `Feedy('on', 'open', handler)`
- `Feedy('on', 'close', handler)`
