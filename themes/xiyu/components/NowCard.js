import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

const CN_MONTHS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

// 首页 "Now · 最近在想" 卡，引用最新文章 summary 作 fallback
const NowCard = ({ posts, allNavPages }) => {
  const slug = siteConfig('XIYU_NOW_SLUG', 'now', CONFIG)
  const now = allNavPages?.find(p => p.slug === slug || p.slug === `/${slug}`)
  const quote = now?.summary || posts?.[0]?.summary || siteConfig('DESCRIPTION') || '记录一些值得三年后再读的思考。'
  const latest = posts?.[0]
  const mm = latest?.publishDay ? parseInt(latest.publishDay.slice(5, 7), 10) : 0
  const monthLabel = mm >= 1 && mm <= 12 ? CN_MONTHS[mm - 1] : ''
  const rawNum = latest?.pageProperties?.num ?? latest?.pageProperties?.Num
  const num = rawNum ? String(rawNum).padStart(4, '0') : ''
  const attr = num
    ? `— #${num}${monthLabel ? ', ' + monthLabel : ''}`
    : monthLabel
      ? `— ${monthLabel}`
      : '— 最近'
  return (
    <aside className='hero-card'>
      <div className='hero-card-label'>Now · 最近在想</div>
      <p className='hero-card-quote'>{quote}</p>
      <div className='hero-card-attr'>{attr}</div>
    </aside>
  )
}

export default NowCard
