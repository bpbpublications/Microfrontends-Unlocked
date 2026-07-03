import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    css: false,
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/__tests__/**/*.spec.tsx', 'src/__tests__/**/*.spec.ts'],
  },
  resolve: {
    alias: {
      '@shop/react-ui': path.resolve(__dirname, '../../packages/react-ui/src/index.ts'),
    },
  },
})
