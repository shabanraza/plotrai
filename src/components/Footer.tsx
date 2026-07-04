import { Link } from '@tanstack/react-router'
import { CITY_CONTENT } from '#/data/city-construction-content'
import { STATE_CONTENT } from '#/data/state-stamp-duty-content'
import { BLOG_BY_SLUG, TOPIC_HUBS, type BlogSlug } from '#/data/blog-content'

const TOOL_LINKS = [
  { label: 'Vastu Checker', to: '/vastu-checker' },
  { label: 'Floor Plan to 3D', to: '/floor-plan-3d' },
  { label: 'Interior Restyle', to: '/interior-restyle' },
  { label: 'Empty Room Stager', to: '/empty-room-stager' },
  { label: 'Plot Area Converter', to: '/plot-converter' },
  { label: 'Material Calculator', to: '/material-calculator' },
  { label: 'Concrete Calculator', to: '/concrete-calculator' },
  { label: 'RCC Slab Calculator', to: '/rcc-slab-calculator' },
  { label: 'Cement Sand Aggregate Calculator', to: '/cement-sand-aggregate-calculator' },
  { label: 'Stamp Duty Calculator', to: '/stamp-duty-calculator' },
  { label: 'Construction Cost Calculator', to: '/construction-cost-calculator' },
  { label: 'Capital Gains Calculator', to: '/property-capital-gains-calculator' },
  { label: 'Indexation Calculator', to: '/indexation-calculator' },
] as const

const PROPERTY_TAX_LINKS = [
  { label: 'BBMP Property Tax Calculator', to: '/bbmp-property-tax-calculator' },
  { label: 'BBMP Property Tax 2026-27', to: '/bbmp-property-tax-2026-27' },
  { label: 'GHMC Property Tax Calculator', to: '/ghmc-property-tax-calculator' },
  {
    label: 'GHMC Property Tax Search by House Number',
    to: '/ghmc-property-tax-search-by-house-number',
  },
  { label: 'MCD Property Tax Calculator', to: '/mcd-property-tax-calculator' },
  { label: 'MCD Property Tax CA Number Guide', to: '/mcd-property-tax-ca-number' },
] as const

const STATIC_LINKS = [
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Privacy', to: '/privacy-policy' },
  { label: 'Terms', to: '/terms' },
  { label: 'Disclaimer', to: '/disclaimer' },
] as const

const FOOTER_GUIDE_SLUGS: ReadonlyArray<BlogSlug> = [
  'property-document-checklist',
  'rera-project-search-guide',
  '30x40-house-plan',
  'steel-price-house-construction',
]

const GUIDE_LINKS = [
  { label: 'All Guides', to: '/blog' },
  ...TOPIC_HUBS.map((hub) => ({ label: hub.title, to: hub.path })),
  ...FOOTER_GUIDE_SLUGS.map((slug) => {
    const article = BLOG_BY_SLUG.get(slug)
    if (!article) {
      throw new Error(`Missing footer guide article: ${slug}`)
    }
    return { label: article.title, to: article.path }
  }),
] as const

const FOOTER_GROUPS = [
  { title: 'Tools', links: TOOL_LINKS },
  { title: 'Property Tax', links: PROPERTY_TAX_LINKS },
  {
    title: 'Construction Cost',
    links: CITY_CONTENT.map((city) => ({
      label: `${city.city} Construction Cost`,
      to: `/construction-cost/${city.slug}`,
    })),
  },
  {
    title: 'Stamp Duty',
    links: STATE_CONTENT.map((state) => ({
      label: `${state.displayName} Stamp Duty`,
      to: `/stamp-duty/${state.slug}`,
    })),
  },
  { title: 'Guides', links: GUIDE_LINKS },
  { title: 'Company', links: STATIC_LINKS },
] as const

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t border-[var(--line)] px-4 pb-14 pt-10 text-[var(--sea-ink-soft)]">
      <div className="page-wrap flex flex-col gap-10">
        <nav
          aria-label="Footer"
          className="grid gap-8 text-left sm:grid-cols-2 lg:grid-cols-6"
        >
          {FOOTER_GROUPS.map((group) => (
            <section key={group.title} className="flex flex-col gap-3">
              <h2 className="text-xs font-medium text-[var(--muted-foreground)]">
                {group.title}
              </h2>
              <ul className="flex flex-col gap-2">
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm leading-snug text-[var(--sea-ink-soft)] transition-colors hover:text-[var(--foreground)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-[var(--line)] pt-6 text-center sm:flex-row sm:text-left">
          <p className="m-0 text-sm">&copy; {year} Plotr Ai. All rights reserved.</p>
          <p className="m-0 text-xs text-[var(--muted-foreground)]">
            Free property and home-planning tools for Indian homeowners.
          </p>
        </div>
      </div>
    </footer>
  )
}
