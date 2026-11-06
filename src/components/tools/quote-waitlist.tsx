import { CircleCheck, FileText } from 'lucide-react'
import { useState } from 'react'
import { Alert, AlertDescription } from '#/components/ui/alert'
import { Button } from '#/components/ui/button'
import { Checkbox } from '#/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet, FieldLegend } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Spinner } from '#/components/ui/spinner'
import { ToggleGroup, ToggleGroupItem } from '#/components/ui/toggle-group'
import {
  QUOTE_PROJECTS,
  QUOTE_ROLES,
  QUOTE_TEST_PRICE,
  QUOTE_WOULD_PAY,
  normaliseContact,
} from '#/lib/quote-waitlist'
import { track } from '#/lib/track'
import { joinQuoteWaitlist } from '#/server/quote-waitlist'

/**
 * "Get this as a client quote" button plus the early-list form behind it. The quote maker does
 * not exist yet: this measures whether contractors want it before we build it. Contact details go
 * only to D1; analytics events carry the answers, never the email or number.
 */
export function QuoteWaitlist({ tool }: { tool: string }) {
  const [open, setOpen] = useState(false)
  const [contact, setContact] = useState('')
  const [role, setRole] = useState('')
  const [projects, setProjects] = useState('')
  const [wouldPay, setWouldPay] = useState('')
  const [consent, setConsent] = useState(false)
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState<'idle' | 'saving' | 'done'>('idle')
  const [error, setError] = useState<string | null>(null)

  const isHomeowner = role === 'homeowner'
  const contactValid = normaliseContact(contact) !== null
  const ready =
    contactValid && role && wouldPay && consent && (isHomeowner || projects) && status === 'idle'

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (next) track('quote_cta_click', { tool })
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    setStatus('saving')
    try {
      await joinQuoteWaitlist({
        data: { contact, role, projects, wouldPay, consent, tool, website },
      })
      track('quote_waitlist_join', {
        tool,
        role,
        projects: isHomeowner ? 'n/a' : projects,
        wouldPay,
        contactType: contact.includes('@') ? 'email' : 'phone',
      })
      setStatus('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setStatus('idle')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto">
          <FileText data-icon="inline-start" />
          Get this as a client quote (PDF)
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[92dvh] overflow-y-auto [scrollbar-width:none] sm:max-w-lg [&::-webkit-scrollbar]:hidden">
        {status === 'done' ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CircleCheck className="size-10 text-[var(--status-success)]" />
            <DialogTitle>You're on the list</DialogTitle>
            <DialogDescription className="text-base text-[var(--foreground)]/80">
              We'll message you once, when the quote maker is ready. Nothing else.
            </DialogDescription>
            <Button className="mt-2" onClick={() => setOpen(false)}>
              Back to the calculator
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <DialogHeader className="text-left">
              <DialogTitle>Client quotes are coming soon</DialogTitle>
              <DialogDescription className="text-[0.9375rem] leading-relaxed text-[var(--foreground)]/80">
                Turn this estimate into a branded PDF quote with a bill of quantities and
                stage-wise payments, ready to send on WhatsApp. Join the early list and we'll tell
                you when it's ready.
              </DialogDescription>
            </DialogHeader>

            <FieldGroup className="gap-4">
              <FieldSet>
                <FieldLegend variant="label">What describes you best?</FieldLegend>
                <ToggleGroup
                  type="single"
                  value={role}
                  onValueChange={(v) => v && setRole(v)}
                  variant="outline"
                  className="grid w-full grid-cols-2"
                >
                  {QUOTE_ROLES.map((r) => (
                    <ToggleGroupItem key={r.value} value={r.value} className="min-h-10">
                      {r.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </FieldSet>

              {role && !isHomeowner && (
                <FieldSet>
                  <FieldLegend variant="label">Projects you quote for in a year</FieldLegend>
                  <ToggleGroup
                    type="single"
                    value={projects}
                    onValueChange={(v) => v && setProjects(v)}
                    variant="outline"
                    className="grid w-full grid-cols-4"
                  >
                    {QUOTE_PROJECTS.map((p) => (
                      <ToggleGroupItem key={p} value={p} className="min-h-10 tabular-nums">
                        {p}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </FieldSet>
              )}

              <FieldSet>
                <FieldLegend variant="label">Would you pay {QUOTE_TEST_PRICE} for it?</FieldLegend>
                <ToggleGroup
                  type="single"
                  value={wouldPay}
                  onValueChange={(v) => v && setWouldPay(v)}
                  variant="outline"
                  className="grid w-full grid-cols-3"
                >
                  {QUOTE_WOULD_PAY.map((w) => (
                    <ToggleGroupItem key={w.value} value={w.value} className="min-h-10">
                      {w.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
                <FieldDescription>Nothing to pay now. This helps us decide what to build.</FieldDescription>
              </FieldSet>

              <Field>
                <FieldLabel htmlFor="quote-contact">Email or WhatsApp number</FieldLabel>
                <Input
                  id="quote-contact"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="you@example.com or 98765 43210"
                  autoComplete="email"
                  inputMode="email"
                  className="h-10"
                />
              </Field>

              {/* Honeypot for bots: hidden from people and screen readers */}
              <input
                type="text"
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="hidden"
              />

              <Field orientation="horizontal">
                <Checkbox
                  id="quote-consent"
                  checked={consent}
                  onCheckedChange={(v) => setConsent(v === true)}
                />
                <FieldLabel htmlFor="quote-consent" className="font-normal leading-snug">
                  Message me when the quote maker is ready. Plotr Ai won't share my details or
                  send anything else.
                </FieldLabel>
              </Field>
            </FieldGroup>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={!ready} className="h-10">
              {status === 'saving' && <Spinner data-icon="inline-start" />}
              Join the early list
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
