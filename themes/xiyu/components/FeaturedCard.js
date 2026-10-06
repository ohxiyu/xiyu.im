import PostTags from './PostTags'
import SmartLink from '@/components/SmartLink'
import { formatNum, formatDateCN } from '../lib/format'

// 首篇文章大卡（feature-card）
const FeaturedCard = ({ post, totalCount, index = 0 }) => {
  if (!post) return null
  const num = formatNum(post, totalCount, index)
  const tags = Array.isArray(post.tags) ? post.tags : []
  return (
    <article className='feature-card'>
      <div className='feature-meta'>
        {num && <span className='post-num'>#{num}</span>}
        <span className='feature-label'>最新</span>
      </div>
      <div className='feature-body'>
        <h2 className='post-title feature-title'>
          <SmartLink href={post.href || `/${post.slug}`} className='feature-link'>
            {post.title}
          </SmartLink>
        </h2>
        {post.summary && <p className='post-excerpt feature-excerpt'>{post.summary}</p>}
        <PostTags tags={tags} />
      </div>
      <div className='row-date-col'><time className='post-date' dateTime={post.publishDay || post.date?.start_date}>{formatDateCN(post.publishDay || post.date?.start_date)}</time></div>
    </article>
  )
}

export default FeaturedCard
