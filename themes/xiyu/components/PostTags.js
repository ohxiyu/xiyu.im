import SmartLink from '@/components/SmartLink'

// 两个常显标签，其余原生展开；长标签列表不挤占摘要和日期。
export default function PostTags({ tags = [] }) {
  const list = Array.isArray(tags) ? tags.filter(Boolean) : []
  if (!list.length) return null
  const link = tag => <SmartLink key={tag} href={`/tag/${encodeURIComponent(tag)}`} className='topic-chip'>{tag}</SmartLink>
  return (
    <div className='post-tags'>
      {list.slice(0, 2).map(link)}
      {list.length > 2 && (
        <details className='tags-overflow'>
          <summary aria-label={`展开另外 ${list.length - 2} 个标签`}>+{list.length - 2}</summary>
          <div className='tags-popover'>{list.slice(2).map(link)}</div>
        </details>
      )}
    </div>
  )
}
