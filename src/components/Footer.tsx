import { Link } from '@tanstack/react-router'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t border-[var(--line)] px-4 pb-14 pt-10 text-[var(--sea-ink-soft)]">
      <div className="page-wrap flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <p className="m-0 text-sm">
          &copy; {year} Plotr Ai. All rights reserved.
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-3 text-xs text-[var(--sea-ink-soft)] sm:justify-end">
          <Link to="/privacy-policy" className="hover:text-[var(--foreground)]">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-[var(--foreground)]">
            Terms
          </Link>
          <Link to="/disclaimer" className="hover:text-[var(--foreground)]">
            Disclaimer
          </Link>
          <Link to="/contact" className="hover:text-[var(--foreground)]">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  )
}
