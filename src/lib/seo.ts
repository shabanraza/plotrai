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
