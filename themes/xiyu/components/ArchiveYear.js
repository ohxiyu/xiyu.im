import { memo } from 'react'
import SmartLink from '@/components/SmartLink'
import { formatNum } from '../lib/format'

// 归档按年份的一块
const ArchiveYear = ({ year, posts }) => {
  const list = Array.isArray(posts) ? posts : []
  if (!list.length) return null
  return (
    <section className='archive-year'>
      <div>
        <div className='year-label'>{year}</div>
        <span className='year-count'>{list.length} posts</span>
      </div>
      <div className='year-list'>
        {list.map(p => {
          const num = formatNum(p)
          const mmdd = (p.publishDay || '').slice(5).replace('-', ' / ')
          return (
            <SmartLink key={p.id || p.slug} href={p.href || `/${p.slug}`} className='archive-item'>
              <span className='post-num'>{num ? `#${num}` : ''}</span>
              <span className='archive-item-title'>{p.title}</span>
              <span className='archive-item-date'>{mmdd}</span>
            </SmartLink>
          )
        })}
      </div>
    </section>
  )
}

export default memo(ArchiveYear)
