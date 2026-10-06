import PostTags from './PostTags'
import { memo } from 'react'
import SmartLink from '@/components/SmartLink'
import { formatNum, formatDateCN } from '../lib/format'

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
        <PostTags tags={tags} />
      </div>
      <div className='row-date-col'>
        <time className='post-date' dateTime={post.publishDay || post.date?.start_date}>{formatDateCN(post.publishDay || post.date?.start_date)}</time>
      </div>
    </article>
  )
}

export default memo(BlogPost)
