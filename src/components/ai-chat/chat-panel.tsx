import { useEffect, useRef, useState } from 'react'
import { Sparkles, Send, MessageSquare } from 'lucide-react'
import { useChat, fetchServerSentEvents } from '@tanstack/ai-react'
import type { UIMessage } from '@tanstack/ai'
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
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '#/components/ui/empty'
import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert'
import { track } from '#/lib/track'
import { cn } from '#/lib/utils'

const STARTER_PROMPTS = [
  'Mera plot Vastu-compliant hai ya nahi kaise check karun?',
  'Plaster ke liye cement aur sand ka ratio kya hona chahiye?',
  'Mumbai mein 1.2 cr ke flat pe stamp duty kitni lagegi?',
  'North-facing ghar mein kaun sa kamra kahan banana chahiye?',
]

function messageText(m: UIMessage): string {
  let text = ''
  for (const part of m.parts) {
    if (part.type === 'text') text += part.content
  }
  return text
}

export function ChatPanel() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const { messages, sendMessage, isLoading, error } = useChat({
    connection: fetchServerSentEvents('/api/chat'),
    onFinish: () => track('chat_message_received'),
  })

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages])

  async function send(content: string) {
    const text = content.trim()
    if (!text || isLoading) return
    setInput('')
    track('chat_message_sent', { length: String(text.length) })
    await sendMessage(text)
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
              Vastu, construction, materials, tax — Hinglish, Hindi ya English mein puchein.
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
                <EmptyTitle>Kya puchhna chahenge?</EmptyTitle>
                <EmptyDescription>
                  Niche se ek sawaal chunein ya apna likhein.
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
              {messages.map((m) => {
                const text = messageText(m)
                return (
                  <li key={m.id} className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                        {m.role === 'user' ? 'You' : 'Plotr Ai'}
                      </span>
                    </div>
                    <div
                      className={cn(
                        'rounded-md px-3 py-2 text-sm leading-relaxed',
                        m.role === 'user'
                          ? 'bg-[var(--accent-teal-light)] text-[var(--foreground)]'
                          : 'bg-[var(--muted)]/50 text-[var(--foreground)]',
                      )}
                    >
                      {text || (m.role === 'assistant' && isLoading ? '…' : '')}
                    </div>
                  </li>
                )
              })}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <li className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                  <Spinner className="size-4" />
                  Soch raha hoon…
                </li>
              )}
              {error && (
                <li>
                  <Alert variant="destructive">
                    <AlertTitle>Couldn't send message</AlertTitle>
                    <AlertDescription>{error.message}</AlertDescription>
                  </Alert>
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
            placeholder="Kuch bhi puchein…"
            rows={1}
            disabled={isLoading}
            className="max-h-32 min-h-9 flex-1 resize-none rounded-md border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]/60 focus:border-[var(--accent-teal)] focus:outline-none disabled:opacity-60"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            aria-label="Send"
          >
            {isLoading ? <Spinner /> : <Send />}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
