import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'
import NowCard from './NowCard'

// 标题里如果有 ：/，/——/—/- 分隔符，自动把最后一段当 em
// 例："AI 交易的护城河不是 Alpha，是纪律" → ["AI 交易的护城河不是 Alpha，", "是纪律"(em)]
// 没分隔符返回整段不 em
const SPLITTERS = ['——', '：', '—', '：', ':', '，', ',', '、']
function splitTitleForEm(title) {
  if (!title || typeof title !== 'string') return [{ text: title || '', em: false }]
  let lastIdx = -1
  let lastSep = ''
  for (const sep of SPLITTERS) {
    const idx = title.lastIndexOf(sep)
    if (idx > lastIdx) { lastIdx = idx; lastSep = sep }
  }
  // 不在末尾太靠后、也不在开头太靠前才切；否则整句不 em
  if (lastIdx < 4 || lastIdx > title.length - 3) {
    return [{ text: title, em: false }]
  }
  return [
    { text: title.slice(0, lastIdx + lastSep.length), em: false },
    { text: title.slice(lastIdx + lastSep.length), em: true }
  ]
}

// 首页 Hero 区：大标题（自动从最近文章抽）+ 副文案（最近写了 + 在想）+ 三个数字 + Now 卡
// 全部从 props.posts 推导，零外部依赖、零维护
const Hero = props => {
  const { posts, postCount, allNavPages, heroPickedIdx, heroPoolSize } = props
  const author = siteConfig('AUTHOR') || 'xiyu'
  const total = typeof postCount === 'number' ? postCount : (posts?.length ?? 0)
  const since = parseInt(siteConfig('SINCE')) || new Date().getFullYear()
  const years = Math.max(1, new Date().getFullYear() - since + 1)
  const bitcoinYears = parseInt(siteConfig('XIYU_BITCOIN_YEARS')) || 7

  const list = Array.isArray(posts) ? posts : []
  const latest = list[0]

  // 大字标题：服务端已经算好 heroPickedIdx，这里直接选
  const pool = list.slice(0, heroPoolSize || 20)
  const picked = pool.length > 0 ? pool[(heroPickedIdx || 0) % pool.length] : null
  const titleSpans = picked ? splitTitleForEm(picked.title) : null

  // 在想：最近 N 篇 tags 按出现顺序去重
  const topicsFrom = parseInt(siteConfig('XIYU_HERO_TOPICS_FROM', 8, CONFIG)) || 8
  const topicsLimit = parseInt(siteConfig('XIYU_HERO_TOPICS_LIMIT', 5, CONFIG)) || 5
  const topics = []
  const seen = new Set()
  for (const p of list.slice(0, topicsFrom)) {
    for (const t of (Array.isArray(p?.tags) ? p.tags : [])) {
      if (t && !seen.has(t)) { seen.add(t); topics.push(t) }
      if (topics.length >= topicsLimit) break
    }
    if (topics.length >= topicsLimit) break
  }

  return (
    <section className='hero'>
      <div>
        <div className='eyebrow hero-eyebrow'>{author}'s notebook · est. {since}</div>
        {titleSpans
          ? (
              <SmartLink
                href={picked.href || `/${picked.slug}`}
                className='hero-title-link'
                title={`阅读：${picked.title}`}>
                <h1 className='hero-title'>
                  {titleSpans.map((s, i) =>
                    s.em
                      ? <em key={i}>{s.text}</em>
                      : <span key={i}>{s.text}</span>
                  )}
                </h1>
              </SmartLink>
            )
          : (
              <h1 className='hero-title'>
                在喧嚣与噪声里，<br />
                写点<em>经得住时间</em>的东西。
              </h1>
            )
        }
        {(latest || topics.length > 0) && (
          <div className='hero-status'>
            {latest && (
              <p className='hero-status-line'>
                <span className='hero-status-label'>最近写了</span>
                <SmartLink
                  href={latest.href || `/${latest.slug}`}
                  className='hero-status-latest'>
                  {latest.title}
                  <span aria-hidden='true' style={{ marginLeft: 4 }}>→</span>
                </SmartLink>
              </p>
            )}
            {topics.length > 0 && (
              <p className='hero-status-line'>
                <span className='hero-status-label'>在想</span>
                <span className='hero-status-topics'>
                  {topics.map((t, i) => (
                    <span key={t}>
                      {i > 0 && <span className='hero-status-dot'> · </span>}
                      {t}
                    </span>
                  ))}
                </span>
              </p>
            )}
          </div>
        )}
        <div className='hero-meta'>
          <div>
            <span className='hero-meta-num'>{total}</span>
            <span className='hero-meta-label'>Essays</span>
          </div>
          <div>
            <span className='hero-meta-num'>{years}</span>
            <span className='hero-meta-label'>Years writing</span>
          </div>
          <div>
            <span className='hero-meta-num'>{bitcoinYears}</span>
            <span className='hero-meta-label'>Long BTC</span>
          </div>
        </div>
      </div>
      <NowCard posts={posts} allNavPages={allNavPages} />
    </section>
  )
}

export default Hero
