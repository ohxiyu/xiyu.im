import {
  getPostCategories,
  getPostCover,
  getPostReadingTime,
  matchesPost
} from '@/themes/xiyu/lib/post'

describe('xiyu post presentation helpers', () => {
  it('only returns a cover when a usable image exists', () => {
    expect(
      getPostCover({ pageCoverThumbnail: ' https://img.example/cover.jpg ' })
    ).toBe('https://img.example/cover.jpg')
    expect(
      getPostCover({ pageCoverThumbnail: '', pageCover: 'undefined' })
    ).toBe('')
  })

  it('uses real reading metadata and does not invent list estimates', () => {
    expect(getPostReadingTime({ readTime: 4.4 })).toBe(4)
    expect(getPostReadingTime({ wordCount: 801 })).toBe(3)
    expect(getPostReadingTime({})).toBeNull()
  })

  it('normalizes categories and combines discovery filters', () => {
    const post = {
      title: 'Agentic Web 的设计原则',
      summary: '让博客更容易被搜索和理解',
      tags: ['AI', 'Web'],
      category: ['技术', '思考'],
      publishDay: '2026-08-21'
    }

    expect(getPostCategories(post)).toEqual(['技术', '思考'])
    expect(
      matchesPost(post, {
        tokens: ['agentic', '搜索'],
        category: '技术',
        year: '2026'
      })
    ).toBe(true)
    expect(matchesPost(post, { category: '生活' })).toBe(false)
  })
})
