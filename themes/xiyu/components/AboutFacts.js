import { siteConfig } from '@/lib/config'

// 四宫格 stats（全部动态：写作年数 / 文章数 / 持有比特币年数 / 主题数）
const AboutFacts = ({ postCount, tagCount }) => {
  const since = parseInt(siteConfig('SINCE')) || new Date().getFullYear()
  const years = Math.max(1, new Date().getFullYear() - since + 1)
  const bitcoinYears = parseInt(siteConfig('XIYU_BITCOIN_YEARS')) || 7
  return (
    <section className='about-facts'>
      <div className='fact'>
        <div className='fact-num'>{years}<span className='unit'>y</span></div>
        <div className='fact-label'>Writing</div>
      </div>
      <div className='fact'>
        <div className='fact-num'>{postCount ?? '—'}</div>
        <div className='fact-label'>Essays published</div>
      </div>
      <div className='fact'>
        <div className='fact-num'>{bitcoinYears}<span className='unit'>y</span></div>
        <div className='fact-label'>Long bitcoin</div>
      </div>
      <div className='fact'>
        <div className='fact-num'>{tagCount ?? '—'}</div>
        <div className='fact-label'>Topics</div>
      </div>
    </section>
  )
}

export default AboutFacts
