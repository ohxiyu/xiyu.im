import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import { eraAnchor } from './AboutRail'

/**
 * 关于页时间轴。
 *
 * 骨架和归档条目、首页文章行是同一个：左边一列定宽的 mono 年份，右边正文，
 * 细线分隔。
 *
 * 结构（年份 + 小标题）来自 themes/xiyu/config.js 的 XIYU_ABOUT_TIMELINE，
 * 正文按顺序取 Notion about 页的段落——所以 **Notion 里段落的顺序有意义**：
 * 第 1/2/3 段分别对应三个时期。段落不够时回退到配置里的 fallback。
 *
 * 每个时期带一个 id，左轨的目录靠它做滚动高亮——id 由 eraAnchor() 统一生成，
 * 别在这里手写。
 */
const AboutTimeline = ({ paragraphs = [] }) => {
  const eras = siteConfig('XIYU_ABOUT_TIMELINE', [], CONFIG) || []
  if (!eras.length) return null
  const methods = siteConfig('XIYU_ABOUT_METHODS_LINE', '', CONFIG)
  const methodsNote = siteConfig('XIYU_ABOUT_METHODS_NOTE', '', CONFIG)

  return (
    <section aria-labelledby='about-timeline-title'>
      <h2 className='rule-head about-sec-label' id='about-timeline-title'>
        <span>Timeline</span>
        <span className='rule-head-rule' aria-hidden='true' />
      </h2>
      <ol className='about-timeline'>
        {eras.map((era, index) => (
          <li className='about-era' key={era.when} id={eraAnchor(index)}>
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
    </section>
  )
}

export default AboutTimeline
