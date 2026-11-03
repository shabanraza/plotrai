import { Link } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { Button } from '#/components/ui/button'
import ThemeToggle from './ThemeToggle'
import { ToolsMenu } from './tools-menu'
import { MobileMenu } from './mobile-menu'
import { SiteSearch } from './site-search'
import { Logo } from './logo'

const NAV_BASE =
  'relative rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors duration-150 no-underline'
const NAV_INACTIVE = `${NAV_BASE} text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--chip-bg)]`
const NAV_ACTIVE = `${NAV_BASE} text-[var(--foreground)] bg-[var(--chip-bg)]`

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 h-14 border-b border-[var(--line)] bg-[var(--header-bg)] backdrop-blur-xl backdrop-saturate-150 lg:h-12">
      <div className="mx-auto flex h-full max-w-7xl items-center gap-2 px-4 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center no-underline" aria-label="Plotr Ai — home">
          <Logo className="h-6 w-auto sm:h-7" />
        </Link>

        <nav aria-label="Main" className="ml-4 hidden items-center gap-0.5 lg:flex">
          <ToolsMenu />
          <Link to="/blog" className={NAV_INACTIVE} activeProps={{ className: NAV_ACTIVE }}>
            Guides
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSearchOpen(true)}
            className="hidden h-8 w-52 justify-start gap-2 bg-transparent font-normal text-[var(--muted-foreground)] lg:flex"
          >
            <Search className="size-3.5" />
            Search
            <kbd className="ml-auto rounded border border-[var(--border)] px-1.5 font-mono text-[10px]">
              Ctrl K
            </kbd>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(true)}
            className="size-10 lg:hidden"
            aria-label="Search"
          >
            <Search className="size-5" />
          </Button>
          <ThemeToggle />
          <div className="lg:hidden">
            <MobileMenu onSearch={() => setSearchOpen(true)} />
          </div>
        </div>
      </div>
      <SiteSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  )
}
