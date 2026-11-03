import { describe, expect, it } from 'vitest'
import { NEXT_STEPS } from '#/data/next-steps'
import { SITE_ENTRIES, SITE_TOOLS } from '#/data/site-map'

const knownPaths = new Set(SITE_ENTRIES.map((e) => e.to))
const toolPaths = new Set(SITE_TOOLS.map((t) => t.to))

describe('NEXT_STEPS', () => {
  it('is keyed by tool paths', () => {
    for (const from of Object.keys(NEXT_STEPS)) expect(toolPaths, from).toContain(from)
  })

  it('points to pages that exist and never back to itself', () => {
    for (const [from, step] of Object.entries(NEXT_STEPS)) {
      expect(knownPaths, step.to).toContain(step.to)
      expect(step.to).not.toBe(from)
    }
  })
})
