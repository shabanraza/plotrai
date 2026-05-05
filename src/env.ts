import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

/**
 * TanStack Start env setup:
 * - Server vars (no prefix) → accessed via process.env in createServerFn
 * - Client vars (VITE_ prefix) → accessed via import.meta.env in components
 *
 * runtimeEnv merges both sources so t3-env can validate all vars.
 */
export const env = createEnv({
  server: {
    SERVER_URL: z.string().url().optional(),
    ANTHROPIC_API_KEY: z.string().min(1).optional(),
    OPENAI_API_KEY: z.string().min(1).optional(),
    SUPABASE_URL: z.string().url().optional(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  },

  clientPrefix: 'VITE_',

  client: {
    VITE_APP_TITLE: z.string().min(1).optional(),
  },

  runtimeEnv: {
    ...import.meta.env,
    ...(typeof process !== 'undefined' ? process.env : {}),
  },

  emptyStringAsUndefined: true,
})
