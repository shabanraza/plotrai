import { Link } from '@tanstack/react-router'
import { footerLinksForHub, SITE_HUBS, hubPath } from '#/data/site-map'

const COMPANY_LINKS = [
  { label: 'All guides', to: '/blog' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Privacy', to: '/privacy-policy' },
  { label: 'Terms', to: '/terms' },
  { label: 'Disclaimer', to: '/disclaimer' },
] as const

/**
 * Five hub columns (up to six links each, plus a link to the hub) and Company. The long state, city and
 * unit lists live on the hub pages; the footer only points at them.
 */
const FOOTER_GROUPS = [
  ...SITE_HUBS.map((hub) => ({
    title: hub.title,
    links: footerLinksForHub(hub.id),
    all: { label: `More on ${hub.title.toLowerCase()}`, to: hubPath(hub.id) },
  })),
  { title: 'Company', links: COMPANY_LINKS, all: null },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 px-4 pb-14 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 border-t border-[var(--line)] pt-10">
        <nav
          aria-label="Footer"
          className="grid grid-cols-2 gap-x-6 gap-y-8 text-left md:grid-cols-3 lg:grid-cols-6"
        >
          {FOOTER_GROUPS.map((group) => (
            <section key={group.title} className="flex flex-col gap-2">
              <h2 className="text-sm font-semibold text-[var(--foreground)]">{group.title}</h2>
              <ul className="flex flex-col">
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="block py-1.5 text-sm leading-snug text-[var(--foreground)]/70 no-underline transition-colors hover:text-[var(--foreground)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                {group.all && (
                  <li>
                    <Link
                      to={group.all.to}
                      className="block py-1.5 text-sm font-medium leading-snug text-[var(--brand)] no-underline hover:underline"
                    >
                      {group.all.label}
                    </Link>
                  </li>
                )}
              </ul>
            </section>
          ))}
        </nav>

        <div className="flex flex-col items-center justify-between gap-2 pt-2 text-center text-sm text-[var(--foreground)]/70 sm:flex-row sm:text-left">
          <p className="m-0">&copy; {year} Plotr Ai</p>
          <p className="m-0">Free property and home-building calculators for India.</p>
        </div>
      </div>
    </footer>
  )
}
