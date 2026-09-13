import { useCallback, useState } from 'react'

/**
 * 左轨下半：阅读信息与分享。
 *
 * 排版跟上面的 TOC 用同一套：mono 小标题 + 一条细线，下面是内容。
 * 这里刻意不用 Card 和带边框的按钮——整根轨只有目录一种语言，
 * 中途插一张卡会把左栏切成两块（和站点其它列表页也不一致）。
 */
const ArticleSide = ({ post }) => {
  const wordCount = post?.wordCount
  const readTime = post?.readTime || (wordCount ? Math.max(1, Math.ceil(wordCount / 400)) : null)
  const [copied, setCopied] = useState(false)

  const copyLink = useCallback(e => {
    e?.preventDefault?.()
    if (typeof window === 'undefined') return
    try {
      navigator.clipboard?.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch (_) {}
  }, [])

  // window 只在点击时读，避免 SSR 算出 '#'、hydration 后才变成真链接
  const openTweet = useCallback(e => {
    e?.preventDefault?.()
    if (typeof window === 'undefined') return
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(post?.title || '')
    window.open(`https://x.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'noopener,noreferrer')
  }, [post?.title])

  return (
    <aside className='article-side'>
      <section className='side-section'>
        <div className='side-label'>Reading</div>
        <dl className='side-stats'>
          <div className='side-stat'>
            <dt>时长</dt>
            <dd>{readTime ? `${readTime} min` : '—'}</dd>
          </div>
          <div className='side-stat'>
            <dt>字数</dt>
            <dd>{wordCount ? wordCount.toLocaleString() : '—'}</dd>
          </div>
        </dl>
      </section>

      <section className='side-section'>
        <div className='side-label'>Share</div>
        <div className='side-actions'>
          <button type='button' className='side-action' onClick={openTweet}>
            分享到 X
          </button>
          <button type='button' className='side-action' onClick={copyLink}>
            {copied ? '已复制' : '复制链接'}
          </button>
        </div>
      </section>
    </aside>
  )
}

export default ArticleSide
