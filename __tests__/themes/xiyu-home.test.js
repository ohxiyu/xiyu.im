import { render, screen, within } from '@testing-library/react'
import Hero from '@/themes/xiyu/components/Hero'
import NowCard from '@/themes/xiyu/components/NowCard'
import Xiyu999Card, { describe as describeNow, rulerPos } from '@/themes/xiyu/components/Xiyu999Card'

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
  beforeEach(() => {
    global.fetch = jest.fn(() => new Promise(() => {}))
  })

  it('左边是站点自述，标题用 AUTHOR，不用中文名', () => {
    render(<Hero posts={posts} postCount={176} />)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('xiyu 的个人博客')
    expect(screen.getByText(/第 176 篇/)).toBeInTheDocument()
  })

  it('右边是 xiyu999 指数模块，链接到独立静态页', () => {
    render(<Hero posts={posts} postCount={12} />)
    const card = screen.getByRole('link', { name: /xiyu999 指数/ })
    expect(card).toHaveAttribute('href', '/xiyu999.html')
    expect(global.fetch).toHaveBeenCalledWith('/api/xiyu999?fields=now')
  })

  it('不再有「旧文重读」', () => {
    render(<Hero posts={posts} postCount={12} />)
    expect(screen.queryByText('旧文重读')).not.toBeInTheDocument()
  })
})

describe('xiyu 首页 xiyu999 模块', () => {
  const now = { date: '2026-11-22', x: 0.972, zone: '定投区', p: 61104, g: 71823, rp: 53206, s1: 0.441, s2: 0.4335 }

  it('拿到数据前显示占位，拿到后显示读数、区间和算式', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ now }) }))
    render(<Xiyu999Card />)
    expect(screen.getByText('—')).toBeInTheDocument()
    expect(await screen.findByText('0.97')).toBeInTheDocument()
    expect(screen.getByText('定投区')).toBeInTheDocument()
    expect(screen.getByText('Mayer 0.80 × MVRV 1.21 = 0.97')).toBeInTheDocument()
  })

  it('接口失败时保留占位，不报错', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('down')))
    render(<Xiyu999Card />)
    await Promise.resolve()
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('描述随价格相对两条成本线的位置变化', () => {
    expect(describeNow(now)).toBe('价格低于 200 日成本 15%，仍高于全网链上成本 15%。')
    expect(describeNow({ ...now, p: 50000 })).toContain('已跌破全网链上成本')
  })

  it('标尺按对数刻度定位', () => {
    expect(rulerPos(0.3)).toBe(0)
    expect(rulerPos(15)).toBe(100)
    expect(rulerPos(1)).toBeGreaterThan(rulerPos(0.65))
  })
})

describe('xiyu 首页 NowCard', () => {
  // 有 slug=now 的页面时用它的 summary；这是让这张卡不和列表大卡重复的唯一办法
  it('优先引用 now 页的 summary', () => {
    const nowPage = { slug: 'now', href: '/now', summary: '在把 Agent 的状态搬进仓库。' }
    const { container } = render(
      <NowCard posts={posts} postCount={12} allNavPages={[...posts, nowPage]} />
    )
    const card = container.querySelector('.now-card')
    expect(within(card).getByText('在把 Agent 的状态搬进仓库。')).toBeInTheDocument()
    expect(card.textContent).not.toContain('摘要 1')
  })

  it('没有 now 页时回落到最新文章的摘要', () => {
    const { container } = render(
      <NowCard posts={posts} postCount={12} allNavPages={posts} />
    )
    expect(within(container.querySelector('.now-card')).getByText('摘要 1')).toBeInTheDocument()
  })
})
