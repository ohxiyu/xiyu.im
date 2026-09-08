import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
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

// 首页 "Now · 最近在想" 卡，引用最新文章 summary 作 fallback
const NowCard = ({ posts, postCount, allNavPages }) => {
  const slug = siteConfig('XIYU_NOW_SLUG', 'now', CONFIG)
  const now = allNavPages?.find(p => p.slug === slug || p.slug === `/${slug}`)
  const quote =
    now?.summary ||
    posts?.[0]?.summary ||
    siteConfig('DESCRIPTION') ||
    '记录一些值得三年后再读的思考。'
  const latest = posts?.[0]
  const mm = latest?.publishDay
    ? parseInt(latest.publishDay.slice(5, 7), 10)
    : 0
  const monthLabel = mm >= 1 && mm <= 12 ? CN_MONTHS[mm - 1] : ''
  const total = typeof postCount === 'number' ? postCount : posts?.length
  const num = latest ? formatNum(latest, total, 0) : ''
  const source = now || latest
  const href =
    source?.href ||
    (source?.slug ? `/${String(source.slug).replace(/^\/+/, '')}` : '')
  const attr = num ? `#${num} · 最近更新` : '最近更新'

  return (
    <aside className='hero-card' aria-label='最近在想'>
      <div className='hero-card-head'>
        <div className='hero-card-label'>Now · 最近在想</div>
        <div className='hero-card-month'>{monthLabel || '最近'}</div>
      </div>
      <p className='hero-card-quote'>{quote}</p>
      <div className='hero-card-footer'>
        <div className='hero-card-attr'>{attr}</div>
        {href && (
          <SmartLink
            href={href}
            className='hero-card-link'
            aria-label='查看最近在想'
          >
            查看近况 <span aria-hidden='true'>→</span>
          </SmartLink>
        )}
      </div>
    </aside>
  )
}

export default NowCard
