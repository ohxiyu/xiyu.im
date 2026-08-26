import SmartLink from '@/components/SmartLink'
import { getPostCover } from '../lib/post'

const PostCover = ({ post, variant = 'row', eager = false, linked = true }) => {
  const cover = getPostCover(post)
  if (!cover) return null

  const image = (
    // Notion cover URLs are dynamic; preserving the original source avoids loader allow-list failures.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={cover}
      alt={post.title || '文章封面'}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : 'auto'}
    />
  )

  if (!linked) {
    return (
      <figure className={`post-cover post-cover-${variant}`}>{image}</figure>
    )
  }

  return (
    <SmartLink
      href={post.href || `/${post.slug}`}
      className={`post-cover post-cover-${variant}`}
      aria-label={`阅读：${post.title}`}
    >
      {image}
    </SmartLink>
  )
}

export default PostCover
