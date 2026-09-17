// 原生折叠区保留全部内容，通过留白分组，不增加分隔线或客户端依赖。
const AboutBoundaries = ({ sections = [] }) => {
  if (!sections.length) return null

  return (
    <section aria-labelledby='about-boundaries-title' id='about-boundaries'>
      <h2 className='section-title about-sec-label' id='about-boundaries-title'>
        <span>这个博客是什么</span>
      </h2>
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
    </section>
  )
}

export default AboutBoundaries
