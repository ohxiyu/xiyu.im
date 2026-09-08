import { siteConfig } from '@/lib/config'

/**
 * 关于页的数据条：一行三项，紧接在头部之后。
 *
 * 旧版是四张卡片（约 120px 高）且排在所有长文之后——数字是全页最好扫的东西，
 * 不该被埋在最后。现在压成一条 42px 高的横条，放在最前。
 */
const AboutFacts = ({ postCount, tagCount }) => {
  const since = parseInt(siteConfig('SINCE')) || new Date().getFullYear()
  const years = Math.max(1, new Date().getFullYear() - since + 1)

  const facts = [
    { value: years, unit: 'y', label: 'Writing' },
    { value: postCount ?? '—', label: 'Essays' },
    { value: tagCount ?? '—', label: 'Topics' }
  ]

  return (
    <div className='about-facts'>
      {facts.map(fact => (
        <div className='about-fact' key={fact.label}>
          <span className='about-fact-value'>
            {fact.value}
            {fact.unit && <span className='about-fact-unit'>{fact.unit}</span>}
          </span>
          <span className='about-fact-label'>{fact.label}</span>
        </div>
      ))}
    </div>
  )
}

export default AboutFacts
