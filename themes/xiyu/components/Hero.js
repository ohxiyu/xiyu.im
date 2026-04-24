import { siteConfig } from '@/lib/config'
import NowCard from './NowCard'

// 首页 Hero 区：大标题 + 副文案 + 三个数字 + Now 卡
const Hero = props => {
  const { posts, postCount, allNavPages } = props
  const author = siteConfig('AUTHOR') || 'xiyu'
  const description = siteConfig('DESCRIPTION') || '币圈十年，AI 三年，思考不停。'
  const total = typeof postCount === 'number' ? postCount : (posts?.length ?? 0)
  const since = parseInt(siteConfig('SINCE')) || new Date().getFullYear()
  const years = Math.max(1, new Date().getFullYear() - since + 1)
  const bitcoinYears = parseInt(siteConfig('XIYU_BITCOIN_YEARS')) || 7

  return (
    <section className='hero'>
      <div>
        <div className='eyebrow hero-eyebrow'>{author}'s notebook · est. {since}</div>
        <h1 className='hero-title'>
          在喧嚣与噪声里，<br />
          写点<em>经得住时间</em>的东西。
        </h1>
        <p className='hero-subtitle'>{description}</p>
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
