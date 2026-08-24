import {
  agenticPages,
  agentTextResources,
  renderAgentInstructions,
  renderLlmsTxt,
  renderPageMarkdown
} from '@/lib/agentic/content'
import { sendAgentText } from '@/lib/agentic/serve-text'
import { getDirectXiyuLayoutName } from '@/lib/agentic/layout'

describe('agent-readable site resources', () => {
  it.each(['home', 'about', 'contact', 'privacy'])(
    '%s contains at least 500 readable characters',
    pageKey => {
      const page = agenticPages[pageKey]
      const text = [
        page.title,
        page.description,
        ...page.sections.flatMap(section => [
          section.heading,
          ...section.paragraphs
        ])
      ].join('')
      expect(text.length).toBeGreaterThanOrEqual(500)
    }
  )

  it('publishes useful llms.txt guidance with when-to-use boundaries', () => {
    const body = renderLlmsTxt()
    expect(body).toContain('Use this site when')
    expect(body).toContain('Do not treat it as')
    expect(body).toContain('https://xiyu.im/sitemap.xml')
    expect(body).toContain('does not currently provide a public API')
  })

  it('links Markdown error recovery to canonical discovery resources', () => {
    const markdown = renderPageMarkdown('home')
    expect(markdown).toMatch(/^# xiyu\.im/m)
    expect(markdown).toContain('[Sitemap](https://xiyu.im/sitemap.xml)')
    expect(markdown).toContain('[Agent guide](https://xiyu.im/llms.txt)')
    expect(markdown).toContain(
      '[Developer resources](https://xiyu.im/developer)'
    )
  })

  it('documents safe attribution and automation boundaries', () => {
    const body = renderAgentInstructions()
    expect(body).toContain('public, read-only personal blog')
    expect(body).toContain('Never infer trading instructions')
    expect(body).toContain('Do not bypass passwords')
  })

  it('serves negotiated resources with exact content and cache headers', () => {
    const headers = {}
    const res = {
      setHeader: jest.fn((key, value) => {
        headers[key] = value
      }),
      end: jest.fn()
    }

    expect(sendAgentText({ res }, 'home')).toEqual({ props: {} })
    expect(res.statusCode).toBe(200)
    expect(headers['Content-Type']).toBe('text/markdown; charset=utf-8')
    expect(headers.Vary).toBe('Accept, Accept-Encoding')
    expect(res.end).toHaveBeenCalledWith(agentTextResources.home.body)
  })

  it('server-renders agent trust pages before dynamic theme hydration', () => {
    expect(
      getDirectXiyuLayoutName({
        theme: 'xiyu',
        layoutName: 'LayoutInfoPage'
      })
    ).toBe('LayoutInfoPage')
    expect(
      getDirectXiyuLayoutName({
        theme: 'xiyu',
        layoutName: 'LayoutSlug',
        post: { slug: 'about' }
      })
    ).toBe('LayoutSlug')
    expect(
      getDirectXiyuLayoutName({
        theme: 'xiyu',
        layoutName: 'LayoutSlug',
        post: { slug: 'article/example' }
      })
    ).toBeNull()
  })
})
