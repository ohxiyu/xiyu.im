import {
  generateStructuredData,
  getDynamicPostOgUrl,
  getMarkdownAlternate,
  getSchemaOrganization
} from '@/components/SEO'

describe('SEO structured data', () => {
  const siteInfo = {
    title: 'Example Blog',
    description: 'Example description',
    icon: '/logo.png'
  }

  it('generates BlogPosting data for published articles', () => {
    const data = generateStructuredData(
      {
        type: 'Post',
        title: 'Structured data in NotionNext',
        description: 'A test article',
        publishTime: '2026-07-01T00:00:00.000Z',
        modifiedTime: '2026-07-02T00:00:00.000Z',
        tags: ['notion', 'seo'],
        category: 'Engineering'
      },
      siteInfo,
      'https://example.com/article/structured-data',
      'https://example.com/cover.png',
      'Example Author',
      'https://example.com'
    )

    expect(data).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: 'Structured data in NotionNext',
      url: 'https://example.com/article/structured-data',
      datePublished: '2026-07-01T00:00:00.000Z',
      dateModified: '2026-07-02T00:00:00.000Z',
      keywords: 'notion, seo',
      articleSection: 'Engineering',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://example.com/article/structured-data'
      }
    })
    expect(data.author).toMatchObject({
      '@type': 'Person',
      name: 'Example Author',
      image: 'https://example.com/logo.png'
    })
  })

  it('generates WebSite data for non-article pages', () => {
    const data = generateStructuredData(
      { type: 'Page' },
      siteInfo,
      'https://example.com/about',
      'https://example.com/cover.png',
      'Example Author',
      'https://example.com'
    )

    expect(data['@context']).toBe('https://schema.org')
    expect(data['@graph']).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          '@type': 'WebSite',
          name: 'Example Blog',
          url: 'https://example.com',
          alternateName: expect.arrayContaining(['xiyu.im', '西羽博客'])
        }),
        expect.objectContaining({
          '@type': 'Blog',
          name: 'Example Blog'
        }),
        expect.objectContaining({
          '@type': 'Person',
          name: 'Example Author'
        })
      ])
    )
  })

  it('only emits Organization schema when public contact and address data is complete', () => {
    expect(getSchemaOrganization({ name: 'Example' })).toBeNull()

    expect(
      getSchemaOrganization({
        name: 'Example Studio',
        email: 'hello@example.com',
        telephone: '+1-202-555-0100',
        streetAddress: '1 Example Street',
        addressLocality: 'Washington',
        addressRegion: 'DC',
        postalCode: '20001',
        addressCountry: 'US'
      })
    ).toMatchObject({
      name: 'Example Studio',
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'hello@example.com',
        telephone: '+1-202-555-0100'
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: '1 Example Street',
        addressCountry: 'US'
      }
    })
  })

  it('advertises explicit Markdown alternates for negotiated pages', () => {
    expect(getMarkdownAlternate('/')).toBe('/index.md')
    expect(getMarkdownAlternate('/about?from=test')).toBe('/about.md')
    expect(getMarkdownAlternate('/privacy/')).toBe('/privacy.md')
    expect(getMarkdownAlternate('/archive')).toBeNull()
  })

  it('builds a dynamic social image URL for text-only posts', () => {
    const image = new URL(
      getDynamicPostOgUrl({
        siteUrl: 'https://example.com',
        title: '没有封面的文章',
        category: ['Writing', 'AI'],
        publishDay: '2026-08-21'
      })
    )

    expect(image.origin + image.pathname).toBe('https://example.com/api/og')
    expect(image.searchParams.get('title')).toBe('没有封面的文章')
    expect(image.searchParams.get('category')).toBe('Writing')
    expect(image.searchParams.get('date')).toBe('2026-08-21')
  })
})
