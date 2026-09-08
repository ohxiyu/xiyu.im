import SmartLink from '@/components/SmartLink'
import { formatNum } from '../lib/format'

const CN_MONTHS = [
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '十二月'
]

/**
 * 首页右上「Now · 最近在想」。
 *
 * 原来这里引用最新文章的 summary 当近况，于是同一段摘要在首页出现两次
 * （这张卡 + 列表大卡）。现在改成列最近三篇的**标题**：同样零维护，
 * 但形态是列表不是引文，和下面的大卡不会读成重复的一段话。
 */
const NowCard = ({ posts, postCount, limit = 3 }) => {
  const all = Array.isArray(posts) ? posts : []
  const list = all.slice(0, limit)
  if (!list.length) return null

  const total = typeof postCount === 'number' ? postCount : all.length
  const mm = list[0]?.publishDay ? parseInt(list[0].publishDay.slice(5, 7), 10) : 0
  const monthLabel = mm >= 1 && mm <= 12 ? CN_MONTHS[mm - 1] : ''

  return (
    <aside className='hero-card' aria-label='最近在想'>
      <div className='hero-card-head'>
        <div className='hero-card-label'>Now · 最近在想</div>
        <div className='hero-card-month'>{monthLabel || '最近'}</div>
      </div>
      <ol className='hero-card-list'>
        {list.map((p, idx) => {
          const num = formatNum(p, total, idx)
          return (
            <li key={p.id || p.slug}>
              <SmartLink
                href={p.href || `/${String(p.slug || '').replace(/^\/+/, '')}`}
                className='hero-card-item'>
                <span className='hero-card-item-num'>{num ? `#${num}` : ''}</span>
                <span className='hero-card-item-title'>{p.title}</span>
              </SmartLink>
            </li>
          )
        })}
      </ol>
      <div className='hero-card-footer'>
        <div className='hero-card-attr'>最近 {list.length} 篇</div>
        <SmartLink href='/archive' className='hero-card-link' aria-label='查看全部文章'>
          看全部 <span aria-hidden='true'>→</span>
        </SmartLink>
      </div>
    </aside>
  )
}

export default NowCard
