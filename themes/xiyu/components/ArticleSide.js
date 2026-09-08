import { useCallback, useState } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

/**
 * 文章详情右侧栏：字数 / 阅读时长 / 分享。
 *
 * 外层 <aside className='article-side'> 必须保留——三栏 grid 靠它上面的
 * `grid-column: 3` 定位（AGENTS.md 第 1 条）。卡片放在它里面。
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

  // window 只在点击时才读，避免 SSR 时算出 '#' 又在 hydration 时变成真链接
  const openTweet = useCallback(e => {
    e?.preventDefault?.()
    if (typeof window === 'undefined') return
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(post?.title || '')
    window.open(`https://x.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'noopener,noreferrer')
  }, [post?.title])

  return (
    <aside className='article-side'>
      <Card className='side-card'>
        <div className='side-stats'>
          <div className='side-stat'>
            <div className='side-stat-label'>Reading time</div>
            <div className='side-stat-value'>{readTime ? `${readTime} min` : '—'}</div>
          </div>
          <div className='side-stat'>
            <div className='side-stat-label'>Words</div>
            <div className='side-stat-value'>{wordCount ? wordCount.toLocaleString() : '—'}</div>
          </div>
        </div>
        <div className='side-actions'>
          <button
            type='button'
            onClick={openTweet}
            className={buttonVariants({ variant: 'outline', size: 'sm' })}>
            分享到 X
          </button>
          <button
            type='button'
            onClick={copyLink}
            className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
            {copied ? '已复制' : '复制链接'}
          </button>
        </div>
      </Card>
    </aside>
  )
}

export default ArticleSide
