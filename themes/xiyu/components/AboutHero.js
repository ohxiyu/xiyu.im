import { siteConfig } from '@/lib/config'
import Image from 'next/image'
import CONFIG from '../config'

/**
 * 关于页头部。
 *
 * 骨架跟首页 Hero 一样：eyebrow（橙短线 + mono 全大写）→ 大衬线名字 →
 * 一句话 → 「在做」那一行。只多一个头像——首页没有，但关于页需要。
 *
 * 之前这里用的是三个 Badge，全站只有关于页出现那种胶囊，所以换掉了。
 */
const AboutHero = () => {
  const author = siteConfig('AUTHOR') || 'xiyu'
  const lead = siteConfig('BIO') || '用 AI Agent 给自己造系统。'
  const since = parseInt(siteConfig('SINCE')) || new Date().getFullYear()
  const doing = siteConfig('XIYU_ABOUT_DOING', [], CONFIG) || []

  return (
    <header className='about-profile'>
      <div className='eyebrow about-eyebrow'>About · since {since}</div>
      <div className='about-profile-row'>
        <div className='about-avatar'>
          <Image
            src='/images/xiyu-avatar.png'
            alt={`${author} 的头像`}
            width={1254}
            height={1254}
            sizes='(max-width: 560px) 60px, 76px'
            className='about-avatar-img'
            priority
          />
        </div>
        <div className='about-profile-body'>
          <h1 className='about-h1'>
            {author}
            <span className='about-h1-dot' aria-hidden='true'>
              .
            </span>
          </h1>
          <p className='about-lead'>{lead}</p>
        </div>
      </div>
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
    </header>
  )
}

export default AboutHero
