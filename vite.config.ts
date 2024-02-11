/// <reference types="vitest" />
import { defineConfig } from 'vite'
import Dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    Dts({
      include: ['./src'],
    }),
  ],
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external(source, importer, isResolved) {
        return (
          importer !== undefined
          && !isResolved
          && !source.startsWith('.')
          && !source.startsWith('/')
        )
      },
    },
  },
  test: {
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'lcov'],
    },
  },
})
