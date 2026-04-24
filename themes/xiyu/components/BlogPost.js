import SmartLink from '@/components/SmartLink'

// 日期 CN 格式：YYYY · MM · DD
const formatDateCN = iso => {
  if (!iso) return ''
  const d = new Date(iso + 'T00:00:00')
  if (isNaN(d.getTime())) return iso
  return `${d.getFullYear()} · ${String(d.getMonth() + 1).padStart(2, '0')} · ${String(d.getDate()).padStart(2, '0')}`
}

const formatNum = (post, totalCount, idx) => {
  const raw = post?.pageProperties?.num ?? post?.pageProperties?.Num
  if (raw) return String(raw).padStart(4, '0')
  if (typeof totalCount === 'number' && typeof idx === 'number') {
    return String(totalCount - idx).padStart(4, '0')
  }
  return ''
}

// 文章列表行（ArticleRow）
const BlogPost = ({ post, totalCount, index = 0 }) => {
  if (!post) return null
  const num = formatNum(post, totalCount, index)
  const flag = post.flag || post.pageProperties?.flag || ''
  const tags = Array.isArray(post.tags) ? post.tags : []
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
        {post.summary && <p className='post-excerpt row-excerpt'>{post.summary}</p>}
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

export default BlogPost
