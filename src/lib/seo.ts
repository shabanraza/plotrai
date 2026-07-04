const SITE_URL = 'https://plotrai.in'

export interface FaqItem {
  q: string
  a: string
}

export interface ToolSchemaInput {
  name: string
  description: string
  path: string
  category?: string
  faqs?: ReadonlyArray<FaqItem>
}

export interface ArticleSchemaInput {
  headline: string
  description: string
  path: string
  datePublished: string
  dateModified: string
  image?: string
  type?: 'Article' | 'BlogPosting'
}

interface JsonLdScript {
  type: 'application/ld+json'
  children: string
}

export function softwareAppLd(input: ToolSchemaInput): JsonLdScript {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: input.name,
    description: input.description,
    url: SITE_URL + input.path,
    applicationCategory: input.category ?? 'UtilitiesApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    publisher: {
      '@type': 'Organization',
      name: 'Plotr Ai',
      url: SITE_URL,
    },
  }
  return { type: 'application/ld+json', children: JSON.stringify(schema) }
}

export function faqPageLd(faqs: ReadonlyArray<FaqItem>): JsonLdScript {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
  return { type: 'application/ld+json', children: JSON.stringify(schema) }
}

export function organizationLd(): JsonLdScript {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Plotr Ai',
    url: SITE_URL,
    logo: SITE_URL + '/favicon.svg',
    description:
      'Free single-purpose tools for Indian homeowners — Vastu, stamp duty, construction material, capital gains, and floor plan visualisation.',
  }
  return { type: 'application/ld+json', children: JSON.stringify(schema) }
}

export function websiteLd(): JsonLdScript {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Plotr Ai',
    url: SITE_URL,
    inLanguage: ['en-IN', 'hi-IN'],
  }
  return { type: 'application/ld+json', children: JSON.stringify(schema) }
}

export function itemListLd(
  name: string,
  items: ReadonlyArray<Pick<ToolSchemaInput, 'name' | 'description' | 'path'>>,
): JsonLdScript {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'WebApplication',
        name: item.name,
        description: item.description,
        url: SITE_URL + item.path,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web',
      },
    })),
  }
  return { type: 'application/ld+json', children: JSON.stringify(schema) }
}

export function articleLd(input: ArticleSchemaInput): JsonLdScript {
  const schema = {
    '@context': 'https://schema.org',
    '@type': input.type ?? 'Article',
    headline: input.headline,
    description: input.description,
    url: SITE_URL + input.path,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    image: input.image ?? `${SITE_URL}/og/landing.png`,
    author: {
      '@type': 'Organization',
      name: 'Plotr Ai',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Plotr Ai',
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.svg`,
    },
    mainEntityOfPage: SITE_URL + input.path,
  }
  return { type: 'application/ld+json', children: JSON.stringify(schema) }
}

export function blogPostingLd(input: Omit<ArticleSchemaInput, 'type'>): JsonLdScript {
  return articleLd({ ...input, type: 'BlogPosting' })
}

/** Returns a canonical link object for TanStack Start head() */
export function canonicalLink(path: string) {
  return { rel: 'canonical' as const, href: `${SITE_URL}${path}` }
}

/** Returns a breadcrumb JSON-LD script for structured data */
export function breadcrumbLd(items: ReadonlyArray<{ name: string; url: string }>): JsonLdScript {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
  return { type: 'application/ld+json', children: JSON.stringify(schema) }
}
