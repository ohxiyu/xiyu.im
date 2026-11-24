import { toSearchIndex } from '@/lib/search/searchIndex'

describe('toSearchIndex', () => {
  const pages = [
    { title: '旧文', slug: 'old', href: '/article/old', publishDate: Date.UTC(2020, 0, 2), tags: ['a'], category: 'c', summary: 'x'.repeat(300) },
    { title: '新文', slug: 'new', href: 'article/new', publishDate: Date.UTC(2026, 10, 20) },
    { title: '', slug: 'notitle' },
    null
  ]
  const out = toSearchIndex(pages)

  it('丢掉没标题的，按发布时间倒序', () => {
    expect(out.map(p => p.t)).toEqual(['新文', '旧文'])
  })
  it('链接补成以 / 开头，日期格式 YYYY-MM-DD，摘要截到 160 字', () => {
    expect(out[0].h).toBe('/article/new')
    expect(out[1].h).toBe('/article/old')
    expect(out[1].d).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(out[1].s).toHaveLength(160)
    expect(out[0].g).toEqual([])
  })
})
