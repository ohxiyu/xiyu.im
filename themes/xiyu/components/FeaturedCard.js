import SmartLink from '@/components/SmartLink'
import { formatNum, formatDateEN } from '../lib/format'

// 首篇文章大卡（feature-card）
const FeaturedCard = ({ post, totalCount, index = 0 }) => {
  if (!post) return null
  const num = formatNum(post, totalCount, index)
  const tags = Array.isArray(post.tags) ? post.tags : []
  return (
    <article className='feature-card'>
      <div className='feature-meta'>
        {num && <span className='post-num'>#{num}</span>}
        <span className='post-date'>{formatDateEN(post.publishDay || post.date?.start_date)}</span>
      </div>
      <div className='feature-body'>
        <h2 className='post-title feature-title'>
          <SmartLink href={post.href || `/${post.slug}`} className='feature-link'>
            {post.title}
          </SmartLink>
        </h2>
        <p className='post-excerpt feature-excerpt'>{post.summary}</p>
        <div className='feature-tags'>
          {tags.map((t, i) => (
            <span key={t}>
              {i > 0 && <span className='tag-dot'>·</span>}
              <span className='tag'>{t}</span>
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}

export default FeaturedCard
