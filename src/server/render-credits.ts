export const SIGNUP_WELCOME_CREDITS = 3
export const ANONYMOUS_RENDERS_PER_DAY = 1

interface D1PreparedStatement {
  bind(...values: Array<unknown>): D1PreparedStatement
  first<T = unknown>(): Promise<T | null>
  run(): Promise<unknown>
}

interface D1Database {
  prepare(query: string): D1PreparedStatement
}

export interface RenderCreditAccount {
  signedIn: boolean
  email?: string
  creditsRemaining: number
}

interface RenderUserRow {
  id: string
  email: string
  session_token: string
  credits_remaining: number
}

export interface RenderSignupInput {
  email: string
}

export interface RenderSignupOutput {
  ok: true
  sessionToken: string
  account: RenderCreditAccount
}

export interface RenderReservation {
  kind: 'anonymous' | 'user' | 'memory'
  userId?: string
  ipHash?: string
  memoryKey?: string
  account?: RenderCreditAccount
}

export function getRenderDb(envSource: unknown): D1Database | null {
  const cfEnv = envSource as { PLOTRAI_DB?: D1Database }
  return cfEnv.PLOTRAI_DB ?? null
}

export function getRequestIp(request: Request | undefined): string {
  const headers = request?.headers
  return (
    headers?.get('cf-connecting-ip') ??
    headers?.get('x-real-ip') ??
    headers?.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'anonymous'
  )
}

export async function hashIdentifier(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function createId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().replaceAll('-', '')}`
}

function toAccount(row: RenderUserRow): RenderCreditAccount {
  return {
    signedIn: true,
    email: row.email,
    creditsRemaining: row.credits_remaining,
  }
}

export async function getAccountByToken(
  db: D1Database,
  sessionToken: string | undefined,
): Promise<(RenderCreditAccount & { userId: string }) | null> {
  if (!sessionToken) return null
  const row = await db
    .prepare(
      'SELECT id, email, session_token, credits_remaining FROM ai_render_users WHERE session_token = ?',
    )
    .bind(sessionToken)
    .first<RenderUserRow>()
  if (!row) return null
  return { ...toAccount(row), userId: row.id }
}

export async function reserveSignedInCredit(
  db: D1Database,
  sessionToken: string,
): Promise<RenderReservation | null> {
  const account = await getAccountByToken(db, sessionToken)
  if (!account) return null
  if (account.creditsRemaining <= 0) {
    throw new Error(
      'Your signup credits are used. Add credits to generate more renders.',
    )
  }

  await db
    .prepare(
      'UPDATE ai_render_users SET credits_remaining = credits_remaining - 1, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND credits_remaining > 0',
    )
    .bind(account.userId)
    .run()

  const updated = await getAccountByToken(db, sessionToken)
  if (!updated) throw new Error('Could not load render credit account.')

  return {
    kind: 'user',
    userId: account.userId,
    account: updated,
  }
}

export async function refundSignedInCredit(
  db: D1Database,
  userId: string,
): Promise<void> {
  await db
    .prepare(
      'UPDATE ai_render_users SET credits_remaining = credits_remaining + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    )
    .bind(userId)
    .run()
}

export async function reserveAnonymousCredit(
  db: D1Database,
  ip: string,
): Promise<RenderReservation> {
  const ipHash = await hashIdentifier(ip)
  const date = todayKey()
  const row = await db
    .prepare(
      'SELECT used FROM anonymous_render_usage WHERE ip_hash = ? AND usage_date = ?',
    )
    .bind(ipHash, date)
    .first<{ used: number }>()

  if ((row?.used ?? 0) >= ANONYMOUS_RENDERS_PER_DAY) {
    throw new Error(
      'Your free render is used for today. Sign up to get 3 more free credits.',
    )
  }

  await db
    .prepare(
      `INSERT INTO anonymous_render_usage (ip_hash, usage_date, used, created_at, updated_at)
       VALUES (?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON CONFLICT(ip_hash, usage_date)
       DO UPDATE SET used = used + 1, updated_at = CURRENT_TIMESTAMP`,
    )
    .bind(ipHash, date)
    .run()

  return { kind: 'anonymous', ipHash }
}

export async function refundAnonymousCredit(
  db: D1Database,
  ipHash: string,
): Promise<void> {
  await db
    .prepare(
      `UPDATE anonymous_render_usage
       SET used = CASE WHEN used > 0 THEN used - 1 ELSE 0 END,
           updated_at = CURRENT_TIMESTAMP
       WHERE ip_hash = ? AND usage_date = ?`,
    )
    .bind(ipHash, todayKey())
    .run()
}

export async function logRenderEvent(
  db: D1Database | null,
  event: {
    userId?: string
    ipHash?: string
    tool: string
    model: string
    status: 'success' | 'failed'
  },
): Promise<void> {
  if (!db) return
  await db
    .prepare(
      `INSERT INTO ai_render_events (id, user_id, ip_hash, tool, model, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    )
    .bind(
      createId('evt'),
      event.userId ?? null,
      event.ipHash ?? null,
      event.tool,
      event.model,
      event.status,
    )
    .run()
}

export async function signupRenderUser(
  db: D1Database,
  email: string,
): Promise<RenderSignupOutput> {
  const existing = await db
    .prepare(
      'SELECT id, email, session_token, credits_remaining FROM ai_render_users WHERE email = ?',
    )
    .bind(email)
    .first<RenderUserRow>()

  if (existing) {
    return {
      ok: true,
      sessionToken: existing.session_token,
      account: toAccount(existing),
    }
  }

  const id = createId('usr')
  const sessionToken = createId('tok')

  await db
    .prepare(
      `INSERT INTO ai_render_users (id, email, session_token, credits_remaining, created_at, updated_at)
       VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    )
    .bind(id, email, sessionToken, SIGNUP_WELCOME_CREDITS)
    .run()

  return {
    ok: true,
    sessionToken,
    account: {
      signedIn: true,
      email,
      creditsRemaining: SIGNUP_WELCOME_CREDITS,
    },
  }
}
