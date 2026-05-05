import { defineConfig } from 'vitest/config'
import viteReact from '@vitejs/plugin-react'

/**
 * Dedicated vitest config so the @cloudflare/vite-plugin (used in vite.config.ts)
 * doesn't try to spin up a Workers runtime during unit tests. The vastu engine
 * is pure TS and only needs basic React + jsdom.
 */
export default defineConfig({
  plugins: [viteReact()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'jsdom',
    include: ['src/**/__tests__/**/*.{test,spec}.{ts,tsx}'],
  },
})
