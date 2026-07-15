import { defineConfig } from 'vite-plus'

export default defineConfig({
  run: {
    cache: true,
  },
  staged: {
    '*': 'vp check --fix',
  },
  fmt: {
    ignorePatterns: ['**/*.md', '*.gen.ts'],
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
    overrides: [
      {
        files: ['apps/dashboard/**'],
        options: {
          sortTailwindcss: {
            stylesheet: './apps/dashboard/src/styles.css',
            functions: ['cn'],
          },
        },
      },
    ],
  },
  lint: {
    jsPlugins: [
      {
        name: 'vite-plus',
        specifier: 'vite-plus/oxlint-plugin',
      },
      {
        name: '@tanstack/query',
        specifier: '@tanstack/eslint-plugin-query',
      },
    ],
    rules: {
      'vite-plus/prefer-vite-plus-imports': 'error',
    },
    overrides: [
      {
        files: ['apps/dashboard/**'],
        rules: {
          '@tanstack/query/exhaustive-deps': 'error',
          '@tanstack/query/no-rest-destructuring': 'warn',
          '@tanstack/query/stable-query-client': 'error',
          '@tanstack/query/no-unstable-deps': 'error',
          '@tanstack/query/infinite-query-property-order': 'error',
          '@tanstack/query/no-void-query-fn': 'error',
          '@tanstack/query/mutation-property-order': 'error',
        },
      },
    ],
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
})
