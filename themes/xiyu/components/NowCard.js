import { siteConfig } from '@/lib/config'

// 首页 "Now · 最近在想" 卡，引用最新文章 summary 作 fallback
const NowCard = ({ posts, allNavPages }) => {
  const now = allNavPages?.find(p => p.slug === 'now' || p.slug === '/now')
  const quote = now?.summary || posts?.[0]?.summary || siteConfig('DESCRIPTION') || '记录一些值得三年后再读的思考。'
  const latest = posts?.[0]
  const mm = latest?.publishDay ? latest.publishDay.slice(5, 7) : ''
  const monthLabel = mm ? `${parseInt(mm)}月` : ''
  const num = latest?.pageProperties?.num || latest?.pageProperties?.Num || ''
  const attr = num ? `— #${num}${monthLabel ? ', ' + monthLabel : ''}` : monthLabel ? `— ${monthLabel}` : '— 最近'
  return (
    <aside className='hero-card'>
      <div className='hero-card-label'>Now · 最近在想</div>
      <p className='hero-card-quote'>{quote}</p>
      <div className='hero-card-attr'>{attr}</div>
    </aside>
  )
}

export default NowCard
