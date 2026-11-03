import { Link } from '@tanstack/react-router'
import { BookOpen, Info, Menu, Search } from 'lucide-react'
import { useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#/components/ui/accordion'
import { Button } from '#/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '#/components/ui/sheet'
import { HUB_PROGRAMMATIC_LABEL, SITE_HUBS, entriesForHub, hubPath } from '#/data/site-map'
import { shortLabel } from './tools-menu'

const ROW_CLASS =
  'flex min-h-11 items-center gap-3 rounded-md px-2 text-[15px] text-[var(--foreground)] no-underline hover:bg-[var(--muted)]/60'

/** Phone and tablet navigation (below lg): search on top, then the five hubs as an accordion. */
export function MobileMenu({ onSearch }: { onSearch: () => void }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="size-10" aria-label="Open menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full gap-0 overflow-y-auto bg-[var(--background)] sm:max-w-sm">
        <SheetHeader className="border-b border-[var(--border)]">
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription className="sr-only">Site navigation</SheetDescription>
        </SheetHeader>

        <div className="px-4 pt-4">
          <Button
            variant="outline"
            className="h-11 w-full justify-start gap-2 bg-transparent text-[15px] font-normal text-[var(--muted-foreground)]"
            onClick={() => {
              close()
              onSearch()
            }}
          >
            <Search className="size-4" />
            Search calculators, states, cities…
          </Button>
        </div>

        <Accordion type="single" collapsible className="px-4 pt-2">
          {SITE_HUBS.map((hub) => {
            const HubIcon = hub.icon
            const quick = HUB_PROGRAMMATIC_LABEL[hub.id]
            const quickLinks = quick ? entriesForHub(hub.id, quick.kind) : []
            return (
              <AccordionItem key={hub.id} value={hub.id}>
                <AccordionTrigger className="min-h-12 items-center text-base hover:no-underline">
                  <span className="flex items-center gap-3">
                    <span className="flex size-8 items-center justify-center rounded-md bg-[var(--accent-teal-light)] text-[var(--accent-teal)]">
                      <HubIcon className="size-4" />
                    </span>
                    {hub.title}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-3">
                  <ul className="grid">
                    <li>
                      <Link
                        to={hubPath(hub.id)}
                        onClick={close}
                        className={`${ROW_CLASS} font-medium text-[var(--accent-teal)]`}
                      >
                        Overview
                      </Link>
                    </li>
                    {entriesForHub(hub.id, 'tool').map((tool) => (
                      <li key={tool.to}>
                        <Link to={tool.to} onClick={close} className={ROW_CLASS}>
                          {tool.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {quick && quickLinks.length > 0 && (
                    <>
                      <p className="mt-3 mb-1 px-2 font-mono text-[10.5px] font-medium tracking-[0.12em] text-[var(--muted-foreground)] uppercase">
                        {quick.label}
                      </p>
                      <ul className="grid grid-cols-2">
                        {quickLinks.map((entry) => (
                          <li key={entry.to}>
                            <Link to={entry.to} onClick={close} className={`${ROW_CLASS} text-sm`}>
                              <span className="truncate">{shortLabel(entry)}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>

        <ul className="grid px-4 py-3">
          <li>
            <Link to="/blog" onClick={close} className={ROW_CLASS}>
              <BookOpen className="size-4 text-[var(--muted-foreground)]" />
              Guides
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={close} className={ROW_CLASS}>
              <Info className="size-4 text-[var(--muted-foreground)]" />
              About
            </Link>
          </li>
        </ul>
      </SheetContent>
    </Sheet>
  )
}
