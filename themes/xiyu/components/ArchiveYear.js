import { memo } from 'react'
import SmartLink from '@/components/SmartLink'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { formatNum } from '../lib/format'

/**
 * 归档里的一年。
 *
 * 每年一张 Card：头部是年份 + 篇数 badge，主体是一列条目。
 * 不用 CardHeader / CardContent——那两个组件带固定的 padding 工具类，
 * 而条目行需要贴到卡片左右边缘才能让 hover 底色铺满（见 AGENTS.md 第 10 条：
 * 用 cx 的组件不能靠 className 覆盖同属性的工具类）。
 */
const ArchiveYear = ({ year, posts }) => {
  const list = Array.isArray(posts) ? posts : []
  if (!list.length) return null
  return (
    <Card className='archive-year' id={`year-${year}`}>
      <div className='archive-year-head'>
        <h2 className='archive-year-label'>{year}</h2>
        <Badge variant='outline'>{list.length} posts</Badge>
      </div>
      <ol className='archive-year-list'>
        {list.map(p => {
          const num = formatNum(p)
          const mmdd = (p.publishDay || '').slice(5).replace('-', ' / ')
          return (
            <li key={p.id || p.slug}>
              <SmartLink href={p.href || `/${p.slug}`} className='archive-item'>
                <span className='archive-item-num'>{num ? `#${num}` : ''}</span>
                <span className='archive-item-title'>{p.title}</span>
                <span className='archive-item-date'>{mmdd}</span>
              </SmartLink>
            </li>
          )
        })}
      </ol>
    </Card>
  )
}

export default memo(ArchiveYear)
