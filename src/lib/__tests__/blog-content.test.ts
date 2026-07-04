import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  BLOG_ARTICLES,
  BLOG_BY_SLUG,
  BLOG_TOOL_META,
  TOPIC_HUBS,
} from '#/data/blog-content'

const SITEMAP_PATH = resolve(process.cwd(), 'public/sitemap.xml')
const KNOWN_TOOL_PATHS = new Set(Object.keys(BLOG_TOOL_META))
const KNOWN_HUB_PATHS = new Set(TOPIC_HUBS.map((hub) => hub.path))

describe('blog content', () => {
  it('uses unique blog slugs', () => {
    const slugs = BLOG_ARTICLES.map((article) => article.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('keeps related links within known tools, hubs, and articles', () => {
    for (const article of BLOG_ARTICLES) {
      for (const toolPath of article.relatedTools) {
        expect(KNOWN_TOOL_PATHS.has(toolPath)).toBe(true)
      }

      for (const relatedSlug of article.relatedArticles) {
        expect(BLOG_BY_SLUG.has(relatedSlug)).toBe(true)
      }

      expect(KNOWN_HUB_PATHS.has(article.topicHubPath)).toBe(true)
    }
  })

  it('keeps core metadata present for every article', () => {
    for (const article of BLOG_ARTICLES) {
      expect(article.title.length).toBeGreaterThan(10)
      expect(article.description.length).toBeGreaterThan(30)
      expect(article.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(article.dateModified).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(article.readingTime.length).toBeGreaterThan(3)
      expect(article.path).toBe(`/blog/${article.slug}`)
      expect(article.relatedTools.length).toBeGreaterThan(0)
      expect(article.relatedArticles.length).toBeGreaterThan(0)
      expect(article.sources.length).toBeGreaterThan(0)
      expect(article.sections.length).toBeGreaterThan(0)
      expect(article.faqs.length).toBeGreaterThan(0)
    }
  })

  it('keeps blog and topic hub urls in the sitemap', () => {
    const sitemap = readFileSync(SITEMAP_PATH, 'utf8')

    expect(sitemap).toContain('https://plotrai.in/blog')

    for (const article of BLOG_ARTICLES) {
      expect(sitemap).toContain(`https://plotrai.in${article.path}`)
    }

    for (const hub of TOPIC_HUBS) {
      expect(sitemap).toContain(`https://plotrai.in${hub.path}`)
    }
  })
})
