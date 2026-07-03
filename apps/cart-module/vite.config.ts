import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'
import path from 'path'

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        // Allow @use 'shared-styles/src/...' to resolve from packages/
        loadPaths: [path.resolve(__dirname, '../../packages')],
      },
    },
  },
  plugins: [
    vue(),
    federation({
      name: 'cartModule',
      filename: 'remoteEntry.js',
      exposes: {
        './mount': './src/mount.ts',
      },
      shared: ['vue', 'vue-router'],
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 3002,
    cors: true,
  },
  preview: {
    port: 3002,
    cors: true,
  },
})
