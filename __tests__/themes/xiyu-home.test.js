import { render, screen, within } from '@testing-library/react'
import Hero from '@/themes/xiyu/components/Hero'
import NowCard from '@/themes/xiyu/components/NowCard'

// SmartLink 会读 next/router 和一堆站点配置，这里只关心渲染出的文字和 href
jest.mock('@/components/SmartLink', () => {
  const React = require('react')
  return function SmartLink({ href, children, ...rest }) {
    return React.createElement('a', { href, ...rest }, children)
  }
})

jest.mock('@/lib/config', () => ({
  siteConfig: (key, defaultVal, extendConfig) => {
    if (key === 'AUTHOR') return 'xiyu'
    if (key === 'SINCE') return 2013
    if (extendConfig && extendConfig[key] !== undefined) return extendConfig[key]
    return defaultVal
  }
}))

const post = (n, extra = {}) => ({
  id: `p${n}`,
  slug: `post-${n}`,
  href: `/post-${n}`,
  title: `文章 ${n}`,
  summary: `摘要 ${n}`,
  publishDay: `2026-0${((n - 1) % 9) + 1}-0${((n - 1) % 9) + 1}`,
  tags: [`tag${n}`],
  ...extra
})

const posts = Array.from({ length: 12 }, (_, i) => post(i + 1))

describe('xiyu 首页 Hero', () => {
  // 首页最容易出的问题就是同一篇文章在一屏里出现好几次：
  // 大标题、Now 卡、列表大卡本来都指向最新那篇。
  it('大标题跳过最近几篇，不和列表里的头条重复', () => {
    render(<Hero posts={posts} postCount={12} allNavPages={posts} renderedOn='2026-09-08' />)
    // 用全等比，别用 toHaveTextContent——它是子串匹配，「文章 12」会命中「文章 1」
    const picked = screen.getByRole('heading', { level: 2 }).textContent
    expect(['文章 1', '文章 2', '文章 3']).not.toContain(picked)
    expect(posts.map(p => p.title)).toContain(picked)
    expect(screen.getByText('旧文重读')).toBeInTheDocument()
  })

  it('同一个 renderedOn 选同一篇，换一天换一篇', () => {
    const pick = day => {
      const { unmount, container } = render(
        <Hero posts={posts} postCount={12} allNavPages={posts} renderedOn={day} />
      )
      const text = container.querySelector('.hero-title').textContent
      unmount()
      return text
    }
    expect(pick('2026-09-08')).toBe(pick('2026-09-08'))
    // 20 天里至少换过一次，否则轮换等于没生效
    const seen = new Set(
      Array.from({ length: 20 }, (_, i) => pick(`2026-09-${String(i + 1).padStart(2, '0')}`))
    )
    expect(seen.size).toBeGreaterThan(1)
  })

  it('文章太少凑不出候选池时回退到固定文案，而不是又拿最新那篇', () => {
    const few = posts.slice(0, 2)
    render(<Hero posts={few} postCount={2} allNavPages={few} renderedOn='2026-09-08' />)
    expect(screen.queryByText('旧文重读')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('经得住时间')
  })
})

describe('xiyu 首页 NowCard', () => {
  it('列最近三篇标题，不再引用文章摘要', () => {
    const { container } = render(<NowCard posts={posts} postCount={12} />)
    const card = container.querySelector('.hero-card')
    expect(within(card).getByText('文章 1')).toBeInTheDocument()
    expect(within(card).getByText('文章 3')).toBeInTheDocument()
    expect(within(card).queryByText('文章 4')).not.toBeInTheDocument()
    // 摘要是重复的来源，卡里不该再出现
    expect(card.textContent).not.toContain('摘要 1')
  })

  it('没有文章时不渲染', () => {
    const { container } = render(<NowCard posts={[]} postCount={0} />)
    expect(container.querySelector('.hero-card')).toBeNull()
  })
})
