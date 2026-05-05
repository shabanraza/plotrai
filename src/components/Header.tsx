import { Link } from '@tanstack/react-router'
import ThemeToggle from './ThemeToggle'
import { ToolsMenu } from './tools-menu'
import { Logo } from './logo'

const NAV_BASE =
  'relative rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors duration-150 no-underline'
const NAV_INACTIVE = `${NAV_BASE} text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--chip-bg)]`
const NAV_ACTIVE = `${NAV_BASE} text-[var(--foreground)] bg-[var(--chip-bg)]`

export default function Header() {
  return (
    <header className="sticky top-0 z-50 h-12 border-b border-[var(--line)] bg-[var(--header-bg)] backdrop-blur-xl backdrop-saturate-150">
      <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6">
        <Link
          to="/"
          className="flex items-center no-underline"
          aria-label="Plotr Ai — home"
        >
          <Logo className="h-6 w-auto sm:h-7" />
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 sm:flex">
          <Link to="/" className={NAV_INACTIVE} activeProps={{ className: NAV_ACTIVE }}>
            Home
          </Link>
          <ToolsMenu />
          <Link to="/about" className={NAV_INACTIVE} activeProps={{ className: NAV_ACTIVE }}>
            About
          </Link>
        </nav>

        <div className="ml-auto flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
