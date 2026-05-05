import { useEffect, useRef, useState } from 'react'
import { Sparkles, Send, MessageSquare } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '#/components/ui/sheet'
import { Button } from '#/components/ui/button'
import { Spinner } from '#/components/ui/spinner'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '#/components/ui/empty'
import { Badge } from '#/components/ui/badge'
import { chat, type ChatMessage, type ChatOutput } from '#/server/chat'
import { track } from '#/lib/track'
import { cn } from '#/lib/utils'

interface UiMessage extends ChatMessage {
  id: string
  source?: ChatOutput['source']
}

const STARTER_PROMPTS = [
  'How do I check if my plot is Vastu-compliant?',
  'What is the cement to sand ratio for plaster?',
  'Stamp duty in Mumbai for a 1.2 cr flat?',
  'Best room placement for a north-facing house?',
]

export function ChatPanel() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Array<UiMessage>>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  async function send(content: string) {
    const text = content.trim()
    if (!text || isLoading) return

    const userMsg: UiMessage = { id: crypto.randomUUID(), role: 'user', content: text }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setIsLoading(true)
    track('chat_message_sent', { length: String(text.length) })

    try {
      const result = await chat({
        data: { messages: next.map(({ role, content }) => ({ role, content })) },
      })
      const assistantMsg: UiMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result.reply,
        source: result.source,
      }
      setMessages((prev) => [...prev, assistantMsg])
      track('chat_message_received', { source: result.source })
    } catch (err) {
      const errMsg: UiMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: err instanceof Error ? err.message : 'Sorry, something went wrong. Try again.',
      }
      setMessages((prev) => [...prev, errMsg])
    } finally {
      setIsLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    void send(input)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="fixed bottom-5 right-5 z-40 flex h-12 items-center gap-2 rounded-full bg-[var(--accent-teal)] px-4 text-sm font-semibold text-white shadow-lg shadow-[var(--accent-teal)]/30 transition-transform hover:scale-105 sm:bottom-7 sm:right-7"
          aria-label="Open Plotr Ai assistant"
          onClick={() => track('chat_opened')}
        >
          <Sparkles className="size-4" />
          <span className="hidden sm:inline">Ask Plotr Ai</span>
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
      >
        <SheetHeader className="flex-row items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <div>
            <SheetTitle className="flex items-center gap-2 text-base">
              <Sparkles className="size-4 text-[var(--accent-teal)]" />
              Ask Plotr Ai
            </SheetTitle>
            <SheetDescription className="text-xs">
              Indian construction, Vastu, materials, and tax — answered.
            </SheetDescription>
          </div>
        </SheetHeader>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4">
          {messages.length === 0 ? (
            <Empty className="border-0">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <MessageSquare />
                </EmptyMedia>
                <EmptyTitle>What can I help with?</EmptyTitle>
                <EmptyDescription>
                  Pick a starter or ask anything about Indian home design.
                </EmptyDescription>
              </EmptyHeader>
              <ul className="mt-4 grid gap-2">
                {STARTER_PROMPTS.map((p) => (
                  <li key={p}>
                    <button
                      type="button"
                      onClick={() => void send(p)}
                      className="w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-left text-sm text-[var(--foreground)] transition-colors hover:border-[var(--accent-teal)]/40 hover:bg-[var(--muted)]/40"
                    >
                      {p}
                    </button>
                  </li>
                ))}
              </ul>
            </Empty>
          ) : (
            <ul className="flex flex-col gap-4">
              {messages.map((m) => (
                <li key={m.id} className="flex flex-col gap-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                      {m.role === 'user' ? 'You' : 'Plotr Ai'}
                    </span>
                    {m.role === 'assistant' && m.source && m.source !== 'openrouter' && (
                      <Badge variant="outline" className="font-mono text-[9px] uppercase tracking-wider">
                        {m.source === 'cloudflare-ai' ? 'CF fallback' : 'error'}
                      </Badge>
                    )}
                  </div>
                  <div
                    className={cn(
                      'rounded-md px-3 py-2 text-sm leading-relaxed',
                      m.role === 'user'
                        ? 'bg-[var(--accent-teal-light)] text-[var(--foreground)]'
                        : 'bg-[var(--muted)]/50 text-[var(--foreground)]',
                    )}
                  >
                    {m.content}
                  </div>
                </li>
              ))}
              {isLoading && (
                <li className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                  <Spinner className="size-4" />
                  Thinking…
                </li>
              )}
            </ul>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-2 border-t border-[var(--border)] bg-[var(--background)] px-4 py-3"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                void send(input)
              }
            }}
            placeholder="Ask anything…"
            rows={1}
            disabled={isLoading}
            className="max-h-32 min-h-9 flex-1 resize-none rounded-md border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/60 focus:border-[var(--accent-teal)] focus:outline-none disabled:opacity-60"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()} aria-label="Send">
            {isLoading ? <Spinner /> : <Send />}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
