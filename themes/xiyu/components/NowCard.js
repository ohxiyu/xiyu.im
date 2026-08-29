import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import { formatNum } from '../lib/format'

const CN_MONTHS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

// 首页 "Now · 最近在想" 卡，与 Hero 的主打文章保持同一信息源。
const NowCard = ({ featured, allNavPages }) => {
  const slug = siteConfig('XIYU_NOW_SLUG', 'now', CONFIG)
  const now = allNavPages?.find(p => p.slug === slug || p.slug === `/${slug}`)
  const quote = now?.summary || featured?.summary || siteConfig('DESCRIPTION') || '记录一些值得三年后再读的思考。'
  const mm = featured?.publishDay ? parseInt(featured.publishDay.slice(5, 7), 10) : 0
  const monthLabel = mm >= 1 && mm <= 12 ? CN_MONTHS[mm - 1] : ''
  const num = featured ? formatNum(featured) : ''
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
