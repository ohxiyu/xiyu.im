import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'
import NowCard from './NowCard'

// 首页 Hero 区：大标题 + 自动副文案（最近写了 + 在想）+ 三个数字 + Now 卡
// 副文案完全从 props.posts 计算，零外部依赖、零维护
const Hero = props => {
  const { posts, postCount, allNavPages, heroLines, heroIdx } = props
  const author = siteConfig('AUTHOR') || 'xiyu'
  const total = typeof postCount === 'number' ? postCount : (posts?.length ?? 0)
  const since = parseInt(siteConfig('SINCE')) || new Date().getFullYear()
  const years = Math.max(1, new Date().getFullYear() - since + 1)
  const bitcoinYears = parseInt(siteConfig('XIYU_BITCOIN_YEARS')) || 7

  // —— 自动副文案 ——
  const list = Array.isArray(posts) ? posts : []
  const latest = list[0]
  // 最近 N 篇文章的 tags 按出现顺序去重，取前 M 个作为"在想"
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
        <h1 className='hero-title'>
          {Array.isArray(heroLines) && heroLines.length > 0 && heroLines[heroIdx || 0]
            ? (heroLines[heroIdx || 0].spans || []).map((span, i) =>
                span.bold
                  ? <em key={i}>{span.text}</em>
                  : <span key={i}>{span.text}</span>
              )
            : (
                <>
                  在喧嚣与噪声里，<br />
                  写点<em>经得住时间</em>的东西。
                </>
              )
          }
        </h1>
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
