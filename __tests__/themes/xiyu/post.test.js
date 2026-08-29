import {
  getPostCategories,
  getPostCover,
  getPostPublishTime,
  getPostReadingTime,
  matchesPost,
  sortPostsByPublishDate
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

  it('sorts padded and unpadded publish dates chronologically', () => {
    const posts = [
      { id: 'aug-3', publishDay: '2026-8-3' },
      { id: 'jul-16', publishDay: '2026-7-16' },
      { id: 'aug-22', publishDay: '2026-08-22' },
      { id: 'aug-20', date: { start_date: '2026-8-20' } }
    ]

    expect(getPostPublishTime(posts[0])).toBe(Date.UTC(2026, 7, 3))
    expect(sortPostsByPublishDate(posts).map(post => post.id)).toEqual([
      'aug-22',
      'aug-20',
      'aug-3',
      'jul-16'
    ])
  })
})
