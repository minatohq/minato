import { defineConfig } from 'vite-plus'

export default defineConfig({
  run: {
    cache: true,
  },
  fmt: {
    semi: false,
    singleQuote: true,
    trailingComma: 'es5',
  },
  lint: {
    jsPlugins: [
      {
        name: 'vite-plus',
        specifier: 'vite-plus/oxlint-plugin',
      },
    ],
    rules: {
      'vite-plus/prefer-vite-plus-imports': 'error',
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  staged: {
    '*': 'vp check --fix',
  },
})
