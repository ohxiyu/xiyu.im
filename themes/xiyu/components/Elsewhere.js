import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * 关于页收尾。
 *
 * 刻意**不**用 .rule-head：页面原本有三条一模一样的横条，把内容切成三段等重的块，
 * 但时间轴是全页主体、这里只有三个链接，节奏是平的。现在只剩两条横条
 * （Timeline 和「这个博客是什么」），收尾降级成一条细线 + 一行字。
 */
const Elsewhere = () => {
  const x = siteConfig('CONTACT_TWITTER') || siteConfig('XIYU_NAV_TWITTER', '', CONFIG)
  const handle = x?.match(/([^/]+)\/?$/)?.[1]

  return (
    <footer className='about-foot'>
      <p className='about-foot-text'>
        纠错、引用确认、或者关于 Agent 与自托管的具体问题，都欢迎。
      </p>
      <div className='about-links'>
        {x && (
          <a href={x} target='_blank' rel='noopener noreferrer' className='inline-link'>
            {handle ? `@${handle}` : 'X'}
          </a>
        )}
        <a href='/feed.xml' className='inline-link'>RSS</a>
        <SmartLink href='/archive' className='inline-link'>归档</SmartLink>
      </div>
    </footer>
  )
}

export default Elsewhere
