import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * 关于页时间轴。
 *
 * 骨架和归档条目、首页文章行是同一个：左边一列定宽的 mono 年份，右边正文，
 * 细线分隔。之前是竖线 + 圆点的那种时间轴——好看，但全站只有这一处长那样。
 *
 * 结构（年份 + 小标题）来自 themes/xiyu/config.js 的 XIYU_ABOUT_TIMELINE，
 * 正文按顺序取 Notion about 页的段落——所以 **Notion 里段落的顺序有意义**：
 * 第 1/2/3 段分别对应三个时期。段落不够时回退到配置里的 fallback。
 *
 * 「拆问题的方法」那三个框架接在最后一个时期后面，是一段话不是三张卡。
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
        <span className='rule-head-count'>{eras.length} 段</span>
      </h2>
      <ol className='about-timeline'>
        {eras.map((era, index) => (
          <li className='about-era' key={era.when}>
            <div className='about-era-when'>{era.when}</div>
            <div className='about-era-body'>
              <h3 className='about-era-title'>{era.title}</h3>
              <p className='about-era-text'>{paragraphs[index] || era.fallback}</p>
              {index === eras.length - 1 && methods && (
                <>
                  <p className='about-era-text'>{methods}</p>
                  {methodsNote && (
                    <p className='about-era-text about-era-note'>{methodsNote}</p>
                  )}
                </>
              )}
            </div>
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
