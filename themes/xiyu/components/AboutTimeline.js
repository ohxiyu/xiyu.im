import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * 关于页时间轴。
 *
 * 结构（年份 + 小标题）来自 themes/xiyu/config.js 的 XIYU_ABOUT_TIMELINE，
 * 正文按顺序取 Notion about 页的段落——所以 **Notion 里段落的顺序有意义**：
 * 第 1/2/3 段分别对应三个时期。段落不够时回退到配置里的 fallback。
 *
 * 这么拆是为了让你仍然能在 Notion 里改正文，而不必动代码；
 * 年份与小标题不常变，放代码里更稳。
 *
 * 「拆问题的方法」那三个框架接在最后一个时期后面，是一段话不是三张卡——
 * 它们在 Notion 原文里本来就是一句话，之前被拆成卡片是过度构建。
 */
const AboutTimeline = ({ paragraphs = [] }) => {
  const eras = siteConfig('XIYU_ABOUT_TIMELINE', [], CONFIG) || []
  if (!eras.length) return null
  const methods = siteConfig('XIYU_ABOUT_METHODS_LINE', '', CONFIG)
  const methodsNote = siteConfig('XIYU_ABOUT_METHODS_NOTE', '', CONFIG)
  const topics = siteConfig('XIYU_ABOUT_TOPICS', [], CONFIG) || []

  return (
    <section aria-labelledby='about-timeline-title'>
      <h2 className='rule-head about-sec-label' id='about-timeline-title'>
        <span>Timeline</span>
              <span className='rule-head-rule' aria-hidden='true' />
      </h2>
      <ol className='about-timeline'>
        {eras.map((era, index) => (
          <li className='about-era' key={era.when}>
            <div className='about-era-head'>
              <span className='about-era-when'>{era.when}</span>
              <h3 className='about-era-title'>{era.title}</h3>
            </div>
            <p className='about-era-text'>{paragraphs[index] || era.fallback}</p>
            {index === eras.length - 1 && methods && (
              <>
                <p className='about-era-text'>{methods}</p>
                {methodsNote && (
                  <p className='about-era-text about-era-note'>{methodsNote}</p>
                )}
              </>
            )}
          </li>
        ))}
      </ol>
      <div className='about-timeline-foot'>
        <span className='about-timeline-topics'>
          {topics.map((topic, i) => (
            <span key={topic}>
              {i > 0 && <span className='hero-status-dot'> · </span>}
              {topic}
            </span>
          ))}
        </span>
        <SmartLink href='/archive' className='about-footer-link'>
          看全部文章 <span aria-hidden='true'>→</span>
        </SmartLink>
      </div>
    </section>
  )
}

export default AboutTimeline
