import { createServerFn } from '@tanstack/react-start'

export interface WaitlistInput {
  email: string
  tool: string
}

export const joinWaitlist = createServerFn({ method: 'POST' })
  .inputValidator((input: WaitlistInput) => {
    if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
      throw new Error('Please provide a valid email address.')
    }
    if (!input.tool) throw new Error('Tool name is required.')
    return input
  })
  .handler(async ({ data }) => {
    const url = process.env['SUPABASE_URL']
    const serviceKey = process.env['SUPABASE_SERVICE_ROLE_KEY']

    if (!url || !serviceKey) {
      console.warn(
        '[waitlist] Supabase env vars not set; logging signup only. Email=%s tool=%s',
        data.email,
        data.tool,
      )
      return { ok: true, persisted: false as const }
    }

    const res = await fetch(`${url}/rest/v1/waitlist`, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=ignore-duplicates',
      },
      body: JSON.stringify({
        email: data.email,
        tool: data.tool,
        created_at: new Date().toISOString(),
      }),
    })

    if (!res.ok && res.status !== 409) {
      const body = await res.text().catch(() => '')
      throw new Error(`Waitlist save failed: ${res.status} ${body}`)
    }

    return { ok: true, persisted: true as const }
  })
