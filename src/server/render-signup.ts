import { createServerFn } from '@tanstack/react-start'
import { env } from 'cloudflare:workers'
import {
  getRenderDb,
  signupRenderUser,
  type RenderSignupInput,
  type RenderSignupOutput,
} from './render-credits'

export const signupForRenderCredits = createServerFn({ method: 'POST' })
  .inputValidator((input: RenderSignupInput) => {
    const email = input.email?.trim().toLowerCase()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Please enter a valid email address.')
    }
    return { email }
  })
  .handler(async ({ data }): Promise<RenderSignupOutput> => {
    const db = getRenderDb(env)
    if (!db) {
      throw new Error(
        'Signup credits are not configured yet. Add the D1 binding.',
      )
    }

    return signupRenderUser(db, data.email)
  })
