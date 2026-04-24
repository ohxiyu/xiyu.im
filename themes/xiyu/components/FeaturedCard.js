import SmartLink from '@/components/SmartLink'

// 文章编号格式化：优先 pageProperties.num，缺省用总数-idx 推算
const formatNum = (post, totalCount, idx) => {
  const raw = post?.pageProperties?.num ?? post?.pageProperties?.Num
  if (raw) return String(raw).padStart(4, '0')
  if (typeof totalCount === 'number' && typeof idx === 'number') {
    return String(totalCount - idx).padStart(4, '0')
  }
  return ''
}

const formatDate = iso => {
  if (!iso) return ''
  const d = new Date(iso + 'T00:00:00')
  if (isNaN(d.getTime())) return iso
  const mo = d.toLocaleString('en-US', { month: 'short' })
  return `${mo} ${d.getDate()}, ${d.getFullYear()}`
}

// 首篇文章大卡（feature-card）
const FeaturedCard = ({ post, totalCount, index = 0 }) => {
  if (!post) return null
  const num = formatNum(post, totalCount, index)
  const tags = Array.isArray(post.tags) ? post.tags : []
  return (
    <article className='feature-card'>
      <div className='feature-meta'>
        {num && <span className='post-num'>#{num}</span>}
        <span className='post-date'>{formatDate(post.publishDay || post.date?.start_date)}</span>
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
