import SmartLink from '@/components/SmartLink'

// 关于页底部主题网格，消费 tagOptions
const Topics = ({ tagOptions }) => {
  const list = Array.isArray(tagOptions) ? tagOptions.slice(0, 12) : []
  if (!list.length) return null
  return (
    <section className='topics-wrap'>
      <div className='topics-head'>
        <div className='eyebrow'>Topics · 我写些什么</div>
        <h2 className='section-title' style={{ marginTop: '14px' }}>按主题浏览</h2>
      </div>
      <div className='topics-grid'>
        {list.map(t => (
          <SmartLink key={t.name} href={`/tag/${encodeURIComponent(t.name)}`} className='topic-cell'>
            <span className='topic-name'>{t.name}</span>
            <span className='topic-count'>{t.count} posts</span>
          </SmartLink>
        ))}
      </div>
    </section>
  )
}

export default Topics
