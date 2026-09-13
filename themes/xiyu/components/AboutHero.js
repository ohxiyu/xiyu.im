import { siteConfig } from '@/lib/config'
import Image from 'next/image'
import CONFIG from '../config'

/**
 * 关于页头部——用的就是文章页的 <header className='article-hero'>。
 *
 * 关于页的正文本来就来自 Notion 的一个页面，所以它整页套用文章页的骨架：
 * 元信息行 → 标题 → lead。这里唯一多出来的是头像，和名字并排成一行，
 * 64px——不再是那个 200px、不承载任何信息的大方块。
 *
 * 大字让给 .article-lead（橙色左边线的斜体引言，文章页已有的零件）。
 */
const AboutHero = () => {
  const author = siteConfig('AUTHOR') || 'xiyu'
  const since = parseInt(siteConfig('SINCE')) || new Date().getFullYear()
  const doing = siteConfig('XIYU_ABOUT_DOING', [], CONFIG) || []
  const bio = siteConfig('BIO') || '用 AI Agent 给自己造系统。写作是公开的思考存档。'

  return (
    <header className='article-hero about-hero' id='about-intro'>
      <div className='article-head-meta'>
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
          <h1 className='article-h1 about-h1'>{author}</h1>
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
      <p className='article-lead'>{bio}</p>
    </header>
  )
}

export default AboutHero
