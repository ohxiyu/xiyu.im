import { siteConfig } from '@/lib/config'

/**
 * 关于页的数字。
 *
 * 直接复用首页 Hero 的 .hero-meta（大衬线数字 + mono 全大写小标签）——
 * 归档页也是同一套，三页统一。之前这里是一条带边框圆角的横条，
 * 全站找不到第二个长那样的东西。
 */
const AboutFacts = ({ postCount, tagCount }) => {
  const since = parseInt(siteConfig('SINCE')) || new Date().getFullYear()
  const years = Math.max(1, new Date().getFullYear() - since + 1)

  const facts = [
    { value: postCount ?? '—', label: 'Essays' },
    { value: years, label: 'Years writing' },
    { value: tagCount ?? '—', label: 'Topics' }
  ]

  return (
    <div className='hero-meta about-meta'>
      {facts.map(fact => (
        <div key={fact.label}>
          <span className='hero-meta-num'>{fact.value}</span>
          <span className='hero-meta-label'>{fact.label}</span>
        </div>
      ))}
    </div>
  )
}

export default AboutFacts
