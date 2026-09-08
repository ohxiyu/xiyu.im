import { Card } from '@/components/ui/card'

/**
 * 「这个博客是什么 / 边界与免责」折叠区。
 *
 * 这里刻意用原生 <details>/<summary> 而不是 Radix Accordion：
 *
 * 1. 零 JS。Radix Accordion 约 20 kB，而这里只需要展开收起。
 * 2. 可访问性原生具备——展开状态、键盘操作、屏幕阅读器语义都由浏览器提供，
 *    不需要手写 aria-expanded / aria-controls，也不会因为实现疏漏而失效。
 * 3. 内容始终在 DOM 里，搜索引擎和 AI 摘要能读到折叠起来的免责声明；
 *    Radix 默认会把未展开的面板从 DOM 移除。
 *
 * 视觉上按 shadcn Accordion 的样子做（summary 行 + 右侧 chevron，展开时旋转），
 * 所以看不出差别，但不用为此加一个依赖。
 *
 * sections: [{ heading, paragraphs: string[] }]
 */
const AboutBoundaries = ({ sections = [] }) => {
  if (!sections.length) return null

  return (
    <section aria-labelledby='about-boundaries-title'>
      <div className='about-sec-label' id='about-boundaries-title'>
        这个博客是什么
      </div>
      <Card>
        <div className='about-disclosure-list'>
          {sections.map((section, index) => (
            <details
              className='about-disclosure'
              key={section.heading}
              open={index === 0}>
              <summary className='about-disclosure-summary'>
                {section.heading}
                <svg
                  className='about-disclosure-chevron'
                  width='15'
                  height='15'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  aria-hidden='true'>
                  <path d='m6 9 6 6 6-6' />
                </svg>
              </summary>
              <div className='about-disclosure-body'>
                {section.paragraphs.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </details>
          ))}
        </div>
      </Card>
    </section>
  )
}

export default AboutBoundaries
