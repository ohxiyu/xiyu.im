import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import Xiyu999Card from './Xiyu999Card'
import NowCard from './NowCard'

/**
 * 首页 Hero：橙色色带。左列上方是 Now · 最近在想，下方是站点自述；右列是 xiyu999 指数模块。
 * 视觉语言与 /xiyu999.html 一致。
 */
const Hero = props => {
  const { posts, postCount, allNavPages } = props
  const total = typeof postCount === 'number' ? postCount : (posts?.length ?? 0)
  const author = siteConfig('AUTHOR') || 'xiyu'
  const since = parseInt(siteConfig('SINCE')) || 2013
  const intro = siteConfig('XIYU_HERO_INTRO', '', CONFIG)

  return (
    <section className='x9-hero' aria-label='站点概览'>
      <div className='x9-hero-main'>
        <NowCard posts={posts} postCount={total} allNavPages={allNavPages} />
        <div className='x9-hero-text'>
          <p className='x9-hero-eyebrow'>
            xiyu.im · 第 {total} 篇 · since {since}
          </p>
          <h1 className='x9-hero-title'>{author} 的个人博客</h1>
          {intro && <p className='x9-hero-intro'>{intro}</p>}
        </div>
      </div>
      <Xiyu999Card />
    </section>
  )
}

export default Hero
