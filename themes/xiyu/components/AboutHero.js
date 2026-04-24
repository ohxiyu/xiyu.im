import { siteConfig } from '@/lib/config'

// 关于页 Hero：羽字肖像 + 大标题 + 一句话
const AboutHero = () => {
  const author = siteConfig('AUTHOR') || 'xiyu'
  const lead = siteConfig('BIO') || '一个普通的干饭人，长期主义者。'
  const glyph = (author || 'x')[0]
  return (
    <section className='about-hero'>
      <div>
        <div className='eyebrow'>About · 关于我</div>
        <h1 className='about-h1'>{author}</h1>
        <p className='about-lead'>{lead}</p>
      </div>
      <div className='portrait-col'>
        <div className='portrait'>
          <div className='portrait-glyph'>{glyph}</div>
          <div className='portrait-scrim'></div>
        </div>
        <div className='portrait-caption'>
          独立开发者 · 长期主义者<br />
          Based in Shanghai · CN
        </div>
      </div>
    </section>
  )
}

export default AboutHero
