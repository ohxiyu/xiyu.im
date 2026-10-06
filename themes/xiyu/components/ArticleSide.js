import ArticleShare from './ArticleShare'

/**
 * 左轨下半：阅读信息与分享。
 *
 * 排版跟上面的 TOC 用同一套：mono 小标题 + 一条细线，下面是内容。
 * 这里刻意不用 Card 和带边框的按钮——整根轨只有目录一种语言，
 * 中途插一张卡会把左栏切成两块（和站点其它列表页也不一致）。
 */
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
