import { render, screen } from '@testing-library/react'
import AboutBoundaries from '@/themes/xiyu/components/AboutBoundaries'
import AboutFacts from '@/themes/xiyu/components/AboutFacts'
import AboutHero from '@/themes/xiyu/components/AboutHero'
import AboutTimeline from '@/themes/xiyu/components/AboutTimeline'
import Elsewhere from '@/themes/xiyu/components/Elsewhere'
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
    if (key === 'BIO') return '用 AI Agent 给自己造系统。'
    if (extendConfig && extendConfig[key] !== undefined) return extendConfig[key]
    return defaultVal
  }
}))

/**
 * 关于页返工过三次（shadcn 卡片 → 再改回站点的细线语言）。
 * 这里把「和首页用同一套类」这件事钉住，别再飘回去。
 */
describe('xiyu 关于页：和首页共用同一套视觉类', () => {
  it('头部用 .eyebrow 和首页的「在想」那一行，不再有 Badge 胶囊', () => {
    const { container } = render(<AboutHero />)
    expect(container.querySelector('.eyebrow')).toBeInTheDocument()
    // .hero-status 就是首页那一行，关于页复用它
    expect(container.querySelector('.hero-status')).toBeInTheDocument()
    expect(screen.getByText('在做')).toBeInTheDocument()
    expect(container.querySelector('.about-badges')).toBeNull()
  })

  it('数字用首页的 .hero-meta，不是自带边框的横条', () => {
    const { container } = render(<AboutFacts postCount={173} tagCount={9} />)
    expect(container.querySelector('.hero-meta')).toBeInTheDocument()
    expect(container.querySelectorAll('.hero-meta-num')).toHaveLength(3)
    expect(container.querySelector('.about-facts')).toBeNull()
    expect(screen.getByText('173')).toBeInTheDocument()
  })

  it('区块标题用共用的 .rule-head', () => {
    const { container } = render(<AboutTimeline paragraphs={[]} />)
    const head = container.querySelector('.rule-head')
    expect(head).toBeInTheDocument()
    expect(head.querySelector('.rule-head-rule')).toBeInTheDocument()
  })

  it('三个框架并进时间轴最后一段，不再是独立的三张卡', () => {
    const { container } = render(<AboutTimeline paragraphs={[]} />)
    const eras = container.querySelectorAll('.about-era')
    expect(eras.length).toBe(CONFIG.XIYU_ABOUT_TIMELINE.length)
    const last = eras[eras.length - 1].textContent
    expect(last).toContain('秩分析')
    expect(last).toContain('第一性原理')
    expect(last).toContain('人性透镜')
  })

  it('Notion 段落按顺序覆盖各时期的 fallback', () => {
    const paragraphs = ['第一段正文', '第二段正文']
    const { container } = render(<AboutTimeline paragraphs={paragraphs} />)
    const eras = container.querySelectorAll('.about-era')
    expect(eras[0].textContent).toContain('第一段正文')
    expect(eras[1].textContent).toContain('第二段正文')
    // 第三段没给，回退到 config 的 fallback
    expect(eras[2].textContent).toContain(CONFIG.XIYU_ABOUT_TIMELINE[2].fallback)
  })

  it('联系入口是文字链，不是按钮', () => {
    const { container } = render(<Elsewhere />)
    expect(container.querySelectorAll('.inline-link').length).toBeGreaterThanOrEqual(2)
    expect(container.querySelector('button')).toBeNull()
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
