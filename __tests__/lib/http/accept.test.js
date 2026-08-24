import {
  appendNegotiationVary,
  preferredMediaType
} from '@/lib/http/accept'

describe('Accept content negotiation', () => {
  it('keeps normal browser and wildcard requests on HTML', () => {
    expect(preferredMediaType(null)).toBe('text/html')
    expect(preferredMediaType('')).toBe('text/html')
    expect(preferredMediaType('*/*')).toBe('text/html')
    expect(preferredMediaType('text/*')).toBe('text/html')
  })

  it('selects Markdown when its q-value is highest', () => {
    expect(
      preferredMediaType('text/markdown, text/html;q=0.8')
    ).toBe('text/markdown')
    expect(
      preferredMediaType('text/html;q=0.5, text/markdown;q=0.9')
    ).toBe('text/markdown')
  })

  it('uses explicit client order to break equal-quality ties', () => {
    expect(preferredMediaType('text/markdown, text/html, */*')).toBe(
      'text/markdown'
    )
    expect(preferredMediaType('text/html, text/markdown')).toBe('text/html')
  })

  it('lets a specific rejection override a broader wildcard', () => {
    expect(preferredMediaType('text/markdown;q=0, */*;q=0.5')).toBe(
      'text/html'
    )
  })

  it('returns null when no available representation is acceptable', () => {
    expect(preferredMediaType('application/json')).toBeNull()
    expect(
      preferredMediaType('text/html;q=0, text/markdown;q=0')
    ).toBeNull()
  })

  it('adds both cache variance fields without duplicates', () => {
    const headers = new Headers({ Vary: 'Origin, Accept' })
    appendNegotiationVary(headers)
    expect(headers.get('Vary')).toBe('Origin, Accept, Accept-Encoding')
  })
})
