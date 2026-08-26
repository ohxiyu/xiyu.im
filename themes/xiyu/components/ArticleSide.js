import ShareActions from './ShareActions'
import { getPostReadingTime } from '../lib/post'

// 文章详情右侧栏：字数 / 阅读时长 / 分享
const ArticleSide = ({ post }) => {
  const wordCount = post?.wordCount
  const readTime = getPostReadingTime(post)

  return (
    <aside className='article-side'>
      <div className='side-stat'>
        <div className='side-stat-label'>Reading time</div>
        <div className='side-stat-value'>
          {readTime ? `${readTime} min` : '—'}
        </div>
      </div>
      <div className='side-stat'>
        <div className='side-stat-label'>Words</div>
        <div className='side-stat-value'>
          {wordCount ? wordCount.toLocaleString() : '—'}
        </div>
      </div>
      <hr className='rule' style={{ margin: '24px 0' }} />
      <div className='side-stat'>
        <div className='side-stat-label'>Share</div>
        <ShareActions post={post} compact />
      </div>
    </aside>
  )
}

export default ArticleSide
