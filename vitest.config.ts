import { defineConfig } from 'vitest/config'

/**
 * Dedicated vitest config so the @cloudflare/vite-plugin (used in vite.config.ts)
 * doesn't try to spin up a Workers runtime during unit tests. The vastu engine
 * is pure TS — no React render is needed by the current test suite.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/__tests__/**/*.{test,spec}.{ts,tsx}'],
  },
})
