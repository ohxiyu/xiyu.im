import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import { formatNum } from '../lib/format'

// 首页 "Now · 最近在想"：优先引用 slug=now 页的 summary，没有就回落到最新文章的摘要
const NowCard = ({ posts, postCount, allNavPages }) => {
  const slug = siteConfig('XIYU_NOW_SLUG', 'now', CONFIG)
  const now = allNavPages?.find(p => p.slug === slug || p.slug === `/${slug}`)
  const quote =
    now?.summary ||
    posts?.[0]?.summary ||
    siteConfig('DESCRIPTION') ||
    '记录一些值得三年后再读的思考。'
  const latest = posts?.[0]
  const day = String(latest?.publishDay || '')
  const year = day.slice(0, 4)
  const mm = parseInt(day.slice(5, 7), 10)
  const total = typeof postCount === 'number' ? postCount : posts?.length
  const num = latest ? formatNum(latest, total, 0) : ''
  const source = now || latest
  const href =
    source?.href ||
    (source?.slug ? `/${String(source.slug).replace(/^\/+/, '')}` : '')
  const attr = now ? '近况笔记' : (num ? `#${num} · 最近更新` : '最近更新')

  return (
    <section className='now-section' aria-labelledby='now-title'>
      <div className='section-head'>
        <h2 id='now-title' className='section-title'>Now · 最近在想</h2>
        <div className='section-actions'><span className='section-count'>{attr}</span></div>
      </div>
      <div className='now-card' aria-label='最近在想'>
        <div className='now-when'>
          {year && <span className='now-year'>{year}</span>}
          <span className='now-month'>
            {mm >= 1 && mm <= 12 ? String(mm) : '—'}
            <small> 月</small>
          </span>
        </div>
        <div className='now-body'>
          <p className='now-quote'>{quote}</p>
          {href && (
            <SmartLink href={href} className='now-link' aria-label='查看最近在想'>
              {now ? '查看近况' : '继续阅读'} <span aria-hidden='true'>→</span>
            </SmartLink>
          )}
        </div>
      </div>
    </section>
  )
}

export default NowCard
