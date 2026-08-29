import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import NowCard from './NowCard'
import { formatDateCN } from '../lib/format'
import { getPostCategories, getPostReadingTime } from '../lib/post'

// 标题里如果有 ：/，/——/—/- 分隔符，自动把最后一段当 em
// 例："AI 交易的护城河不是 Alpha，是纪律" → ["AI 交易的护城河不是 Alpha，", "是纪律"(em)]
// 没分隔符返回整段不 em
const SPLITTERS = ['——', '：', '—', '：', ':', '，', ',', '、']
const MAX_HIGHLIGHT_CHARS = 12

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

  const separatorEnd = lastIdx + lastSep.length
  const tail = title.slice(separatorEnd)
  const tailChars = Array.from(tail)

  // Luni-style highlight works best as one compact phrase. For a long clause,
  // prefer the final two space-delimited phrases (useful for mixed CN/EN titles),
  // otherwise keep only the final Chinese phrase-length segment highlighted.
  if (tailChars.length > MAX_HIGHLIGHT_CHARS) {
    const words = tail.trim().split(/\s+/).filter(Boolean)
    if (words.length >= 3) {
      const highlight = words.slice(-2).join(' ')
      const highlightAt = title.lastIndexOf(highlight)
      return [
        { text: title.slice(0, highlightAt), em: false },
        { text: title.slice(highlightAt), em: true }
      ]
    }

    const normalTail = tailChars.slice(0, -MAX_HIGHLIGHT_CHARS).join('')
    const highlight = tailChars.slice(-MAX_HIGHLIGHT_CHARS).join('')
    return [
      { text: title.slice(0, separatorEnd) + normalTail, em: false },
      { text: highlight, em: true }
    ]
  }

  return [
    { text: title.slice(0, separatorEnd), em: false },
    { text: tail, em: true }
  ]
}

// 首页 Hero 区：大标题（自动从最近文章抽）+ 副文案（最近写了 + 在想）+ 三个数字 + Now 卡
// 全部从 props.posts 推导，零外部依赖、零维护
const Hero = props => {
  const { posts, postCount, allNavPages } = props
  const author = siteConfig('AUTHOR') || 'xiyu'
  const total = typeof postCount === 'number' ? postCount : (posts?.length ?? 0)
  const since = parseInt(siteConfig('SINCE')) || new Date().getFullYear()
  const years = Math.max(1, new Date().getFullYear() - since + 1)
  const bitcoinYears = parseInt(siteConfig('XIYU_BITCOIN_YEARS')) || 7

  const list = Array.isArray(posts) ? posts : []
  const latest = list[0]

  // 阅读优先：首页永远展示最新文章，避免刷新后主角变化，也避免和列表顺序冲突。
  const picked = latest
  const titleSpans = picked ? splitTitleForEm(picked.title) : null
  const pickedDate = picked
    ? formatDateCN(picked.publishDay || picked.date?.start_date)
    : ''
  const pickedReadTime = getPostReadingTime(picked)
  const pickedCategories = getPostCategories(picked).slice(0, 3)

  return (
    <section className='hero'>
      <div>
        <div className='eyebrow hero-eyebrow'>{author}&apos;s notebook · est. {since}</div>
        {titleSpans
          ? (
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
            )
          : (
              <h2 className='hero-title'>
                在喧嚣与噪声里，<br />
                写点<em>经得住时间</em>的东西。
              </h2>
            )
        }
        {picked && (
          <div className='hero-feature-meta' aria-label='主打文章信息'>
            {pickedDate && <span>{pickedDate}</span>}
            {pickedReadTime && <span>{pickedReadTime} min read</span>}
            {pickedCategories.map(category => <span key={category}>{category}</span>)}
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
      <NowCard featured={picked} allNavPages={allNavPages} />
    </section>
  )
}

export default Hero
