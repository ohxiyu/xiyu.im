import { memo } from 'react'
import SmartLink from '@/components/SmartLink'
import { formatNum, formatDateCN } from '../lib/format'

// 文章列表行（ArticleRow）
const BlogPost = ({ post, totalCount, index = 0, compact = false }) => {
  if (!post) return null
  const num = formatNum(post, totalCount, index)
  const flag = post.flag || post.pageProperties?.flag || ''
  const tags = Array.isArray(post.tags) ? post.tags : []
  const cover = getPostCover(post)
  const readTime = getPostReadingTime(post)

  if (compact) {
    return (
      <article className='article-row-compact'>
        <h3 className='compact-post-title'>
          <SmartLink href={post.href || `/${post.slug}`} className='compact-post-link'>
            {flag && <span className='row-flag'>{flag}</span>}
            {post.title}
          </SmartLink>
        </h3>
        <div className='compact-post-meta'>
          <span className='post-date'>
            {formatDateCN(post.publishDay || post.date?.start_date)}
          </span>
          {readTime && <span className='post-read-time'>{readTime} min</span>}
        </div>
      </article>
    )
  }

  return (
    <article className='article-row'>
      <div className='row-num-col'>
        {num && <span className='post-num'>#{num}</span>}
      </div>
      <div className='row-main'>
        <h3 className='post-title row-title'>
          <SmartLink href={post.href || `/${post.slug}`} className='row-link'>
            {flag && <span className='row-flag'>{flag}</span>}
            {post.title}
          </SmartLink>
        </h3>
        <p className='post-excerpt row-excerpt'>{post.summary || ''}</p>
        <div className='row-tags'>
          {tags.map((t, i) => (
            <span key={t}>
              {i > 0 && <span className='tag-dot'>·</span>}
              <span className='tag-plain'>{t}</span>
            </span>
          ))}
        </div>
      </div>
      <div className='row-date-col'>
        <span className='post-date'>{formatDateCN(post.publishDay || post.date?.start_date)}</span>
      </div>
    </article>
  )
}

export default memo(BlogPost)
