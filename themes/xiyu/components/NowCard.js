import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import { formatNum } from '../lib/format'

// 首页 Hero 左上的 "Now · 最近在想"：优先引用 slug=now 页的 summary，没有就回落到最新文章的摘要
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
  const when = day.length >= 7 ? `${day.slice(0, 4)}-${day.slice(5, 7)}` : ''
  const total = typeof postCount === 'number' ? postCount : posts?.length
  const num = latest ? formatNum(latest, total, 0) : ''
  const source = now || latest
  const href =
    source?.href ||
    (source?.slug ? `/${String(source.slug).replace(/^\/+/, '')}` : '')
  const attr = now ? '近况笔记' : (num ? `#${num}` : '')

  return (
    <aside className='now-card' aria-label='最近在想'>
      <div className='now-head'>
        <span className='now-label'>Now · 最近在想</span>
        <span className='now-when'>{[when, attr].filter(Boolean).join(' · ')}</span>
      </div>
      <p className='now-quote'>{quote}</p>
      {href && (
        <SmartLink href={href} className='now-link' aria-label='查看最近在想'>
          {now ? '查看近况' : '继续阅读'} <span aria-hidden='true'>→</span>
        </SmartLink>
      )}
    </aside>
  )
}

export default NowCard
