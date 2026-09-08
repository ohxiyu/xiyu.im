import { memo } from 'react'
import SmartLink from '@/components/SmartLink'
import { formatNum } from '../lib/format'

/**
 * 归档里的一年。
 *
 * 版式跟首页「最新写作」里的年份分组一致：一条 `2026 ————— 12 posts` 的横线，
 * 下面是行。刻意不用 Card——首页和关于页之外，站点的列表语言是细线和留白，
 * 归档里堆十几张卡会比首页还重。
 */
const ArchiveYear = ({ year, posts }) => {
  const list = Array.isArray(posts) ? posts : []
  if (!list.length) return null
  return (
    <section className='archive-year' id={`year-${year}`}>
      <h2 className='archive-year-head'>
        <span className='archive-year-num'>{year}</span>
        <span className='archive-year-rule' aria-hidden='true' />
        <span className='archive-year-count'>{list.length} posts</span>
      </h2>
      <ol className='archive-year-list'>
        {list.map(p => {
          const num = formatNum(p)
          const mmdd = (p.publishDay || '').slice(5).replace('-', ' / ')
          return (
            <li key={p.id || p.slug}>
              <SmartLink href={p.href || `/${p.slug}`} className='archive-item'>
                <span className='post-num'>{num ? `#${num}` : ''}</span>
                <span className='archive-item-title'>{p.title}</span>
                <span className='post-date archive-item-date'>{mmdd}</span>
              </SmartLink>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

export default memo(ArchiveYear)
