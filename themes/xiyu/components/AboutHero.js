import Badge from '@/components/ui/badge'
import { siteConfig } from '@/lib/config'
import Image from 'next/image'
import CONFIG from '../config'

/**
 * 关于页头部：头像紧跟名字与介绍，整组左对齐。
 *
 * 旧版是名字在左、头像被推到右端，中间留一大片空。
 */
const AboutHero = () => {
  const author = siteConfig('AUTHOR') || 'xiyu'
  const lead = siteConfig('BIO') || '用 AI Agent 给自己造系统。'
  const location = siteConfig('XIYU_ABOUT_LOCATION', 'Based in anywhere', CONFIG)

  return (
    <header className='about-profile'>
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
        <div className='about-badges'>
          <Badge>Agent builder</Badge>
          <Badge>Long-term thinker</Badge>
          <Badge variant='outline'>{location}</Badge>
        </div>
      </div>
    </header>
  )
}

export default AboutHero
