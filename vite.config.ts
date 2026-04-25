import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [react()],
  base: '/', // Base URL for GitHub user site
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core — rarely changes, highly cacheable
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'vendor-react'
          }
          // Framer Motion — animation library used across many components
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion'
          }
          // UI primitives — Radix UI + Lucide icons
          if (
            id.includes('node_modules/@radix-ui') ||
            id.includes('node_modules/lucide-react')
          ) {
            return 'vendor-ui'
          }
          // Type animation — only used by Header component
          if (id.includes('node_modules/react-type-animation')) {
            return 'vendor-type-animation'
          }
          // GitHub calendar widget — only used by About component
          if (id.includes('node_modules/react-github-calendar')) {
            return 'vendor-calendar'
          }
          // Gemini AI SDK — only used by ChatbotWidget
          if (id.includes('node_modules/@google/genai')) {
            return 'vendor-genai'
          }
        },
      },
    },
  },
})