import { render, screen, within } from '@testing-library/react'
import AboutBoundaries from '@/themes/xiyu/components/AboutBoundaries'
import AboutHero from '@/themes/xiyu/components/AboutHero'
import AboutRail, { eraAnchor } from '@/themes/xiyu/components/AboutRail'
import AboutTimeline from '@/themes/xiyu/components/AboutTimeline'
import CONFIG from '@/themes/xiyu/config'

jest.mock('@/components/SmartLink', () => {
  const React = require('react')
  return function SmartLink({ href, children, ...rest }) {
    return React.createElement('a', { href, ...rest }, children)
  }
})

jest.mock('next/image', () => {
  const React = require('react')
  // 只保留原生 <img> 认识的属性——priority / sizes 这类 next/image 专有属性
  // 直接透传到 DOM 会让 React 报「non-boolean attribute」警告
  return function Image({ src, alt, width, height, className }) {
    // eslint-disable-next-line @next/next/no-img-element
    return React.createElement('img', { src, alt, width, height, className })
  }
})

jest.mock('@/lib/config', () => ({
  siteConfig: (key, defaultVal, extendConfig) => {
    if (key === 'AUTHOR') return 'xiyu'
    if (key === 'SINCE') return 2013
    if (key === 'BIO') return '用 AI Agent 给自己造系统。写作是公开的思考存档。'
    if (extendConfig && extendConfig[key] !== undefined) return extendConfig[key]
    return defaultVal
  }
}))

const ERAS = CONFIG.XIYU_ABOUT_TIMELINE

/**
 * 关于页返工过五次。根因是它一直是站里的第三种版式——既不是首页也不是文章页。
 * 现在它整页套用文章详情的骨架，这些断言钉的就是这件事。
 */
describe('xiyu 关于页：整页套用文章页的骨架', () => {
  it('头部用的是文章页的 .article-hero / .article-h1 / .article-lead', () => {
    const { container } = render(<AboutHero />)
    expect(container.querySelector('.article-hero')).toBeInTheDocument()
    expect(container.querySelector('.article-h1')).toBeInTheDocument()
    const lead = container.querySelector('.article-lead')
    expect(lead).toBeInTheDocument()
    // 大字让给 lead（那句自述），h1 只是名字
    expect(lead.textContent.length).toBeGreaterThan(10)
    expect(container.querySelector('.about-avatar')).toBeInTheDocument()
    expect(screen.getByText('在做')).toBeInTheDocument()
  })

  it('左轨三段：目录 + 站点数字 + 联系方式，用的是文章页左轨的类', () => {
    const { container } = render(
      <AboutRail eras={ERAS} postCount={173} tagCount={9} />
    )
    // 目录就是文章页那个 <TOC>，不是另写的一份
    expect(container.querySelector('.toc')).toBeInTheDocument()
    expect(container.querySelector('.toc-label')).toBeInTheDocument()
    // 数字和联系方式用 ArticleSide 的类
    const side = container.querySelector('.article-side')
    expect(within(side).getByText('This site')).toBeInTheDocument()
    expect(within(side).getByText('Elsewhere')).toBeInTheDocument()
    expect(within(side).getByText('173')).toBeInTheDocument()
    expect(side.querySelectorAll('.inline-link').length).toBeGreaterThanOrEqual(2)
  })

  it('目录锚点和正文里的 id 一一对上（对不上滚动高亮就是死的）', () => {
    const { container: rail } = render(
      <AboutRail eras={ERAS} postCount={173} tagCount={9} />
    )
    const hrefs = [...rail.querySelectorAll('.toc-link')].map(a =>
      a.getAttribute('href').replace(/^#/, '')
    )
    const { container: tl } = render(<AboutTimeline paragraphs={[]} />)
    const rendered = new Set([...tl.querySelectorAll('.about-era')].map(el => el.id))
    ERAS.forEach((_, i) => {
      expect(hrefs).toContain(eraAnchor(i))
      expect(rendered.has(eraAnchor(i))).toBe(true)
    })
    // 头部和折叠区的锚点也在目录里
    expect(hrefs).toContain('about-intro')
    expect(hrefs).toContain('about-boundaries')
  })

  it('头部的 id 是 about-intro，折叠区是 about-boundaries', () => {
    const { container: hero } = render(<AboutHero />)
    expect(hero.querySelector('#about-intro')).toBeInTheDocument()
    const { container: b } = render(
      <AboutBoundaries sections={[{ heading: 'x', paragraphs: ['y'] }]} />
    )
    expect(b.querySelector('#about-boundaries')).toBeInTheDocument()
  })

  it('区块标题用共用的 .rule-head，页面上只剩两条', () => {
    const { container: tl } = render(<AboutTimeline paragraphs={[]} />)
    const { container: b } = render(
      <AboutBoundaries sections={[{ heading: 'x', paragraphs: ['y'] }]} />
    )
    expect(tl.querySelectorAll('.rule-head')).toHaveLength(1)
    expect(b.querySelectorAll('.rule-head')).toHaveLength(1)
    expect(tl.querySelector('.rule-head-rule')).toBeInTheDocument()
  })

  it('三个框架并进时间轴最后一段，不是独立的卡', () => {
    const { container } = render(<AboutTimeline paragraphs={[]} />)
    const eras = container.querySelectorAll('.about-era')
    expect(eras).toHaveLength(ERAS.length)
    const last = eras[eras.length - 1].textContent
    expect(last).toContain('秩分析')
    expect(last).toContain('第一性原理')
    expect(last).toContain('人性透镜')
  })

  it('Notion 段落按顺序覆盖各时期的 fallback', () => {
    const { container } = render(
      <AboutTimeline paragraphs={['第一段正文', '第二段正文']} />
    )
    const eras = container.querySelectorAll('.about-era')
    expect(eras[0].textContent).toContain('第一段正文')
    expect(eras[1].textContent).toContain('第二段正文')
    // 第三段没给，回退到 config 的 fallback
    expect(eras[2].textContent).toContain(ERAS[2].fallback)
  })

  it('时间轴是「左年份 + 右正文」两列，和归档条目同一个骨架', () => {
    const { container } = render(<AboutTimeline paragraphs={[]} />)
    const era = container.querySelector('.about-era')
    expect(era.querySelector('.about-era-when')).toBeInTheDocument()
    expect(era.querySelector('.about-era-body')).toBeInTheDocument()
    // 竖线圆点那套已经去掉了
    expect(container.querySelector('.about-era-head')).toBeNull()
  })

  it('头部大字不和时间轴里的小标题重复', () => {
    const { container: hero } = render(<AboutHero />)
    const lead = hero.querySelector('.article-lead').textContent
    const { container: tl } = render(<AboutTimeline paragraphs={[]} />)
    for (const el of tl.querySelectorAll('.about-era-title')) {
      expect(lead).not.toContain(el.textContent)
    }
  })

  it('折叠区仍是原生 <details>，内容始终在 DOM 里（给搜索引擎读）', () => {
    const sections = [
      { heading: '这是什么', paragraphs: ['一段说明'] },
      { heading: '免责', paragraphs: ['另一段'] }
    ]
    const { container } = render(<AboutBoundaries sections={sections} />)
    const details = container.querySelectorAll('details')
    expect(details).toHaveLength(2)
    // 第二个是收起的，但文字仍然在 DOM 里
    expect(details[1].open).toBe(false)
    expect(details[1].textContent).toContain('另一段')
  })
})
