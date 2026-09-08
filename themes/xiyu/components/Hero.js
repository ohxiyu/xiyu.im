import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import { Badge } from '@/components/ui/badge'
import CONFIG from '../config'
import NowCard from './NowCard'
import { formatNum, formatYear } from '../lib/format'

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

// FNV-1a。要的不是散列质量，是**确定性**：同一个 seed 在服务端和客户端算出同一个数，
// 否则 hydration 会不一致。所以这里不能用 Math.random()，也不能直接读 Date——
// 当天的日期由 getStaticProps 作为 renderedOn 传进来，ISR 每次重新生成时才会变。
function hashIndex(seed, size) {
  if (!size) return 0
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) % size
}

/**
 * 首页 Hero。
 *
 * 大标题刻意**不取最新文章**：最新的那篇下面的列表已经用大卡讲了一遍，
 * 再放到 hero 就是同一篇文章在一屏里出现两次。这里改成从更早的文章里
 * 轮换一篇「旧文重读」——既避开重复，也让 170 多篇旧文有个露面的位置。
 *
 * 轮换的种子是 renderedOn（getStaticProps 给的 UTC 日期），所以 ISR 每天
 * 换一篇；文章不够多（少于 skip+1 篇）时回退到一句固定的自述。
 */
const Hero = props => {
  const { posts, postCount, allNavPages, renderedOn } = props
  const author = siteConfig('AUTHOR') || 'xiyu'
  const total = typeof postCount === 'number' ? postCount : (posts?.length ?? 0)
  const since = parseInt(siteConfig('SINCE')) || new Date().getFullYear()
  const years = Math.max(1, new Date().getFullYear() - since + 1)

  const list = Array.isArray(posts) ? posts : []

  // 候选池：首页 props.posts 只有当前页的十几篇，allNavPages 才是全部文章。
  // 掐掉最前面几篇（它们正在列表里露脸），剩下的才是「旧文」。
  const skip = parseInt(siteConfig('XIYU_HERO_SKIP_RECENT', 3, CONFIG))
  const poolSize = parseInt(siteConfig('XIYU_HERO_POOL', 40, CONFIG)) || 40
  const source = Array.isArray(allNavPages) && allNavPages.length > list.length ? allNavPages : list
  const pool = source.slice(Number.isFinite(skip) ? skip : 3, (Number.isFinite(skip) ? skip : 3) + poolSize)
  const picked = pool.length ? pool[hashIndex(String(renderedOn || total), pool.length)] : null
  const titleSpans = picked ? splitTitleForEm(picked.title) : null
  const pickedYear = picked ? formatYear(picked.publishDay || picked.publishDate) : ''
  const pickedNum = picked ? formatNum(picked) : ''

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
        <div className='eyebrow hero-eyebrow'>{author}&apos;s notebook · est. {since}</div>
        {titleSpans
          ? (
              <>
                <div className='hero-revisit'>
                  <Badge variant='accent'>旧文重读</Badge>
                  {(pickedYear || pickedNum) && (
                    <span className='hero-revisit-when'>
                      {[pickedYear, pickedNum && `#${pickedNum}`].filter(Boolean).join(' · ')}
                    </span>
                  )}
                </div>
                <SmartLink
                  href={picked.href || `/${picked.slug}`}
                  className='hero-title-link'
                  title={`阅读：${picked.title}`}>
                  <h2 className='hero-title'>
                    {titleSpans.map((s, i) =>
                      s.em
                        ? <em key={i}>{s.text}</em>
                        : <span key={i}>{s.text}</span>
                    )}
                  </h2>
                </SmartLink>
              </>
            )
          : (
              <h2 className='hero-title'>
                在喧嚣与噪声里，<br />
                写点<em>经得住时间</em>的东西。
              </h2>
            )
        }
        {topics.length > 0 && (
          <div className='hero-status'>
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
        </div>
      </div>
      <NowCard posts={posts} postCount={postCount} />
    </section>
  )
}

export default Hero
