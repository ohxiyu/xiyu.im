import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'
import NowCard from './NowCard'
import { formatNum, formatYear } from '../lib/format'

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
 * 旧文推荐刻意**不取最新文章**：最新的那篇下面的列表已经用大卡讲了一遍，
 * 再放到 hero 就是同一篇文章在一屏里出现两次。从更早的文章里
 * 轮换一篇「旧文重读」——既避开重复，也让 170 多篇旧文有个露面的位置。
 *
 * 轮换的种子是 renderedOn（getStaticProps 给的 UTC 日期），所以 ISR 每天
 * 换一篇；文章不够多（少于 skip+1 篇）时回退到一句固定的自述。
 */
const Hero = props => {
  const { posts, postCount, allNavPages, renderedOn } = props
  const total = typeof postCount === 'number' ? postCount : (posts?.length ?? 0)
  const year = parseInt(String(renderedOn || '').slice(0, 4)) || parseInt(siteConfig('SINCE')) || 2013
  const since = parseInt(siteConfig('SINCE')) || year
  const years = Math.max(1, year - since + 1)

  const list = Array.isArray(posts) ? posts : []

  // 候选池：首页 props.posts 只有当前页的十几篇，allNavPages 才是全部文章。
  // 掐掉最前面几篇（它们正在列表里露脸），剩下的才是「旧文」。
  const skip = parseInt(siteConfig('XIYU_HERO_SKIP_RECENT', 3, CONFIG))
  const poolSize = parseInt(siteConfig('XIYU_HERO_POOL', 40, CONFIG)) || 40
  const source = Array.isArray(allNavPages) && allNavPages.length > list.length ? allNavPages : list
  const pool = source.slice(Number.isFinite(skip) ? skip : 3, (Number.isFinite(skip) ? skip : 3) + poolSize)
  const picked = pool.length ? pool[hashIndex(String(renderedOn || total), pool.length)] : null
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
    <section className='hero' aria-label='笔记概览'>
      <div className='hero-context'>
        <div className='hero-feature'>
          <div className='eyebrow'>xiyu&apos;s notebook · est. {since}</div>
          {picked
            ? <>
                <div className='hero-revisit'>
                  <span className='context-label'>旧文重读</span>
                  <span className='hero-revisit-when'>{[pickedYear, pickedNum && `#${pickedNum}`].filter(Boolean).join(' · ')}</span>
                </div>
                <SmartLink href={picked.href || `/${picked.slug}`} className='hero-title-link' title={`阅读：${picked.title}`}>
                  <h1 className='hero-title'>{picked.title}</h1>
                </SmartLink>
              </>
            : <h1 className='hero-title'>在喧嚣与噪声里，写点经得住时间的东西。</h1>}
          {topics.length > 0 && (
            <div className='hero-topics'>
              <span className='hero-topics-label'>在想</span>
              {topics.map(t => <SmartLink key={t} href={`/tag/${encodeURIComponent(t)}`} className='topic-chip'>{t}</SmartLink>)}
            </div>
          )}
          <div className='hero-meta'>
            <div><span className='hero-meta-num'>{total}</span><span className='hero-meta-label'>ESSAYS</span></div>
            <div><span className='hero-meta-num'>{years}</span><span className='hero-meta-label'>YEARS WRITING</span></div>
          </div>
        </div>
        <NowCard posts={posts} postCount={postCount} allNavPages={allNavPages} />
      </div>
    </section>
  )
}

export default Hero
