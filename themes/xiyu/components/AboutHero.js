import { siteConfig } from '@/lib/config'
import Image from 'next/image'
import CONFIG from '../config'

// 关于页沿用首页的字体、状态行和配色，独立单栏排版。
const AboutHero = () => {
  const author = siteConfig('AUTHOR') || 'xiyu'
  const since = parseInt(siteConfig('SINCE')) || new Date().getFullYear()
  const doing = siteConfig('XIYU_ABOUT_DOING', [], CONFIG) || []
  const bio = siteConfig('BIO') || '用 AI Agent 给自己造系统。写作是公开的思考存档。'

  return (
    <header className='about-hero' id='about-intro'>
      <div className='eyebrow'>
        <span className='post-num'>ABOUT</span>
        <span className='post-date'>SINCE {since}</span>
      </div>
      <div className='about-idrow'>
        <div className='about-avatar'>
          <Image
            src='/images/xiyu-avatar.png'
            alt={`${author} 的头像`}
            width={1254}
            height={1254}
            sizes='(max-width: 768px) 56px, 64px'
            className='about-avatar-img'
            priority
          />
        </div>
        <div className='about-idrow-body'>
          <h1 className='about-h1 serif'>{author}</h1>
          {doing.length > 0 && (
            <div className='hero-status about-status'>
              <p className='hero-status-line'>
                <span className='hero-status-label'>在做</span>
                <span className='hero-status-topics'>
                  {doing.map((item, i) => (
                    <span key={item}>
                      {i > 0 && <span className='hero-status-dot'> · </span>}
                      {item}
                    </span>
                  ))}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
      <p className='about-bio'>{bio}</p>
    </header>
  )
}

export default AboutHero
