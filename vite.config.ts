import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/**
 * Tailwind v4 is configured through this plugin, not a tailwind.config.js —
 * the theme lives in src/index.css inside @theme. There is deliberately no
 * config file to keep in sync.
 *
 * The `@` alias means deep features can import shared code without counting
 * ../../.. levels, which is the thing that quietly rots as the tree grows.
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
})
