import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

// Notion 段落顺序与各时期对应；保留现有锚点以兼容历史链接。
const AboutTimeline = ({ paragraphs = [] }) => {
  const eras = siteConfig('XIYU_ABOUT_TIMELINE', [], CONFIG) || []
  if (!eras.length) return null
  const methods = siteConfig('XIYU_ABOUT_METHODS_LINE', '', CONFIG)
  const methodsNote = siteConfig('XIYU_ABOUT_METHODS_NOTE', '', CONFIG)

  return (
    <section aria-labelledby='about-timeline-title'>
      <h2 className='section-title about-sec-label' id='about-timeline-title'>
        <span>我的经历</span>
      </h2>
      <ol className='about-timeline'>
        {eras.map((era, index) => (
          <li className='about-era' key={era.when} id={`about-era-${index}`}>
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
