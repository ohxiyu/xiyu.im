import { render, screen, within } from '@testing-library/react'
import AboutBoundaries from '@/themes/xiyu/components/AboutBoundaries'
import AboutHero from '@/themes/xiyu/components/AboutHero'
import AboutFooter from '@/themes/xiyu/components/AboutFooter'
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

describe('xiyu 关于页：单栏内容与链接', () => {
  it('保留身份、自述和当前在做', () => {
    render(<AboutHero />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('xiyu')
    expect(screen.getByText('在做')).toBeInTheDocument()
    expect(screen.getByText('用 AI Agent 给自己造系统。写作是公开的思考存档。')).toBeInTheDocument()
  })

  it('正文末尾仍可访问联系方式、订阅、归档与站点数字', () => {
    const { container } = render(<AboutFooter postCount={173} tagCount={9} />)
    const links = screen.getByRole('navigation', { name: '关于页联系方式' })
    expect(within(links).getByRole('link', { name: /@ohxiyu/ })).toHaveAttribute('href', 'https://x.com/ohxiyu')
    expect(within(links).getByRole('link', { name: 'RSS' })).toHaveAttribute('href', '/feed.xml')
    expect(within(links).getByRole('link', { name: '归档' })).toHaveAttribute('href', '/archive')
    expect(container).toHaveTextContent('173 篇文章 · 9 个主题 · 始于 2013')
  })

  it('保留经历锚点，已有深链接仍可定位', () => {
    const { container } = render(<AboutTimeline />)
    ERAS.forEach((_, i) => expect(container.querySelector(`#about-era-${i}`)).toBeInTheDocument())
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

  it('头部大字不和时间轴里的小标题重复', () => {
    const { container: hero } = render(<AboutHero />)
    const lead = hero.querySelector('.about-bio').textContent
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
