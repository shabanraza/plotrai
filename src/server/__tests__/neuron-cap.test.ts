import { describe, expect, it } from 'vitest'
import {
  FREE_RENDERS_PER_USER_PER_DAY,
  getUserRenderUsage,
  refundUserRender,
  reserveUserRender,
} from '../neuron-cap'

describe('AI render quota', () => {
  it('allows one free render per user per day and can refund failed calls', () => {
    const userKey = `ip:test-${Date.now()}-${Math.random()}`

    expect(getUserRenderUsage(userKey).remaining).toBe(
      FREE_RENDERS_PER_USER_PER_DAY,
    )

    expect(reserveUserRender(userKey)).toMatchObject({
      ok: true,
      used: 1,
      remaining: 0,
    })

    expect(reserveUserRender(userKey)).toMatchObject({
      ok: false,
      used: 1,
      remaining: 0,
    })

    refundUserRender(userKey)

    expect(getUserRenderUsage(userKey)).toMatchObject({
      used: 0,
      remaining: FREE_RENDERS_PER_USER_PER_DAY,
    })
  })
})
