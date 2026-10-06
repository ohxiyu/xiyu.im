import ArticleShare from './ArticleShare'

// 桌面阅读轨：阅读信息及与文末共用的精简分享控件。
const ArticleSide = ({ post }) => {
  const wordCount = post?.wordCount
  const readTime = post?.readTime || (wordCount ? Math.max(1, Math.ceil(wordCount / 400)) : null)
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
        <ArticleShare post={post} />
      </section>
    </aside>
  )
}

export default ArticleSide
