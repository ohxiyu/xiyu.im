import { useCallback } from 'react'

// 文章详情右侧栏：字数 / 阅读时长 / 分享
const ArticleSide = ({ post }) => {
  const wordCount = post?.wordCount
  const readTime = post?.readTime || (wordCount ? Math.max(1, Math.ceil(wordCount / 400)) : null)

  const copyLink = useCallback(e => {
    e?.preventDefault?.()
    if (typeof window === 'undefined') return
    try {
      navigator.clipboard?.writeText(window.location.href)
    } catch (_) {}
  }, [])

  const twitterShare = (() => {
    if (typeof window === 'undefined') return '#'
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(post?.title || '')
    return `https://twitter.com/intent/tweet?url=${url}&text=${text}`
  })()

  return (
    <aside className='article-side'>
      <div className='side-stat'>
        <div className='side-stat-label'>Reading time</div>
        <div className='side-stat-value'>{readTime ? `${readTime} min` : '—'}</div>
      </div>
      <div className='side-stat'>
        <div className='side-stat-label'>Words</div>
        <div className='side-stat-value'>{wordCount ? wordCount.toLocaleString() : '—'}</div>
      </div>
      <hr className='rule' style={{ margin: '24px 0' }} />
      <div className='side-stat'>
        <div className='side-stat-label'>Share</div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
          <a className='inline-link' href={twitterShare} target='_blank' rel='noopener noreferrer' style={{ fontSize: '13px' }}>Twitter</a>
          <a className='inline-link' href='#' onClick={copyLink} style={{ fontSize: '13px' }}>Copy link</a>
        </div>
      </div>
    </aside>
  )
}

export default ArticleSide
