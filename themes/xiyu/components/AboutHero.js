import Image from 'next/image'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

// 关于页 Hero：个人简介 + 头像 + 当前身份
const AboutHero = () => {
  const author = siteConfig('AUTHOR') || 'xiyu'
  const lead = siteConfig('BIO') || '一个普通的干饭人，长期主义者。'
  const location = siteConfig(
    'XIYU_ABOUT_LOCATION',
    'Based in Shanghai · CN',
    CONFIG
  )
  const bitcoinYears =
    parseInt(siteConfig('XIYU_BITCOIN_YEARS', 7, CONFIG)) || 7

  return (
    <section className='about-hero'>
      <div className='about-intro'>
        <div className='eyebrow'>About · 关于我</div>
        <h1 className='about-h1'>
          {author}
          <span aria-hidden='true'>.</span>
        </h1>
        <p className='about-lead'>{lead}</p>
        <div className='about-signals' aria-label='个人标签'>
          <span>Independent builder</span>
          <span>Long-term thinker</span>
          <span>{bitcoinYears}y · Long bitcoin</span>
        </div>
      </div>

      <figure className='portrait-col'>
        <div className='portrait'>
          <Image
            src='/images/xiyu-avatar.png'
            alt={`${author} 的头像`}
            width={1254}
            height={1254}
            sizes='(max-width: 768px) 100vw, 380px'
            className='portrait-image'
            priority
          />
          <div className='portrait-scrim' aria-hidden='true' />
          <span className='portrait-badge'>Stay curious · Keep building</span>
        </div>
        <figcaption className='portrait-caption'>
          <span>独立开发者 · 长期主义者</span>
          <span>{location}</span>
        </figcaption>
      </figure>
    </section>
  )
}

export default AboutHero
