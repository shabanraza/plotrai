import { useState, type FormEvent } from 'react'
import { Mail, Check, type LucideIcon } from 'lucide-react'
import { Spinner } from '#/components/ui/spinner'
import { Badge } from '#/components/ui/badge'
import { joinWaitlist } from '#/server/waitlist'

interface ComingSoonCardProps {
  icon: LucideIcon
  title: string
  description: string
  toolKey: string
}

export function ComingSoonCard({ icon: Icon, title, description, toolKey }: ComingSoonCardProps) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email) return
    setState('loading')
    setErrorMsg('')
    try {
      await joinWaitlist({ data: { email, tool: toolKey } })
      setState('done')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
      setState('error')
    }
  }

  return (
    <div className="frosted flex h-full flex-col rounded-2xl p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--muted)] text-[var(--muted-foreground)]">
          <Icon className="size-5" />
        </div>
        <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-[0.12em]">
          Soon
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <h3 className="text-base font-semibold tracking-tight text-[var(--foreground)]">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">{description}</p>
      </div>

      {state === 'done' ? (
        <div className="mt-6 flex items-center gap-2 rounded-xl bg-[var(--accent-teal-light)] px-4 py-2.5 text-sm font-medium text-[var(--accent-teal)]">
          <Check className="size-4" />
          You're on the list.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)]/60 pl-3 transition-colors focus-within:border-[var(--accent-teal)]">
            <Mail className="size-3.5 shrink-0 text-[var(--muted-foreground)]" />
            <input
              type="email"
              required
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={state === 'loading'}
              className="flex-1 bg-transparent py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/60 focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={state === 'loading' || !email}
              className="my-1 mr-1 inline-flex items-center gap-1 rounded-lg bg-[var(--accent-teal)] px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-white hover:bg-[var(--accent-teal)]/90 disabled:opacity-50"
            >
              {state === 'loading' ? <Spinner className="size-3" /> : 'Notify'}
            </button>
          </div>
          {state === 'error' && (
            <p className="px-1 text-xs text-[var(--status-critical)]">{errorMsg}</p>
          )}
        </form>
      )}
    </div>
  )
}
