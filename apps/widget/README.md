# How it works

## Snippet

This is a piece of code that customers manually add on their websites.

```html
<script>
  window.Minato = window.Minato || function (...args) {
    window.Minato.q = window.Minato.q || []
    window.Minato.subscriptionCount = window.Minato.subscriptionCount || 0

    if (args[0] === 'on') {
      const subscriptionId = `s_${++window.Minato.subscriptionCount}`

      window.Minato.q.push(['on', subscriptionId, args[1], args[2]])

      return function unsubscribe() {
        window.Minato('off', subscriptionId)
      }
    }

    window.Minato.q.push(args)
  }

  // Initialize the widget with customer's project ID
  Minato('init', {
    projectId: 'NlhWOVQWzIV6g6Jr',
  })
</script>
<script src="https://cdn.minato.so/widget.js"></script> <!-- Bootstrap script -->
```

## Bootstrap script

This script is also added by the customer (see snippet above).

It does these things:

1. Checks whether the bootstrap has already run so loading the script more than once does not initialize another widget runtime.
2. Reads the commands and event subscriptions queued by the snippet before the bootstrap script finished loading.
3. Replaces the temporary `window.Minato` queue function with the real widget API.
4. Replays the queued calls in order. New calls are added to the same command chain so asynchronous commands, such as `init`, finish before later commands run.
5. When processing `init`, validates the project ID and loads the project's widget configuration.
6. Waits until the document is interactive, then adds the widget's root container and styles to the page.
7. If the launcher is enabled, creates an iframe inside the root container and loads the launcher script in it. The launcher announces when it is ready through `postMessage`, the bootstrap responds with the launcher configuration and current widget state, and launcher clicks are sent back to the bootstrap to toggle the widget. Bootstrap sends subsequent open-state changes to the launcher so it can switch between the launcher and close icons.
8. Marks the widget as ready and emits the `ready` event.

## Widget API

`window.Minato` - the public API

Supported commands:

- `Minato('init', config)`
- `Minato('open')`
- `Minato('close')`
- `Minato('showLauncher')`
- `Minato('hideLauncher')`
- `Minato('destroy')`
- `Minato('on', event, handler)`

Supported events:

- `const unsubscribe = Minato('on', 'ready', handler)`
- `const unsubscribe = Minato('on', 'open', handler)`
- `const unsubscribe = Minato('on', 'close', handler)`
- `const unsubscribe = Minato('on', 'showLauncher', handler)`
- `const unsubscribe = Minato('on', 'hideLauncher', handler)`

Call the returned `unsubscribe` function to remove that listener.
