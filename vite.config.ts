import { defineConfig } from 'vite-plus'

export default defineConfig({
  run: {
    cache: true,
  },
  staged: {
    '*': 'vp check --fix',
  },
  fmt: {
    ignorePatterns: ['**/*.md'],
    semi: false,
    singleQuote: true,
    trailingComma: 'es5',
    sortImports: {
      internalPattern: ['@/'],
      newlinesBetween: false,
      partitionByNewline: true,
      customGroups: [
        {
          groupName: 'repo',
          elementNamePattern: ['@repo/**/*'],
          modifiers: ['value'],
        },
        {
          groupName: 'type-repo',
          elementNamePattern: ['@repo/**/*'],
          modifiers: ['type'],
        },
      ],
      groups: [
        'builtin',
        'external',
        'repo',
        'internal',
        'parent',
        'sibling',
        'index',
        'type-builtin',
        'type-external',
        'type-repo',
        'type-internal',
        'type-parent',
        'type-sibling',
        'type-index',
      ],
    },
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
})
