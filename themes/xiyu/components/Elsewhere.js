import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * 关于页底部的联系入口。
 *
 * 一句话 + 一行文字链。之前是 Card 加三个带边框的按钮，全站没有第二处长那样——
 * 正文里的链接是 .inline-link（常态带下划线，hover 变色），这里用同一个。
 */
const Elsewhere = () => {
  const x = siteConfig('CONTACT_TWITTER') || siteConfig('XIYU_NAV_TWITTER', '', CONFIG)
  const handle = x?.match(/([^/]+)\/?$/)?.[1]

  return (
    <section aria-labelledby='about-elsewhere-title'>
      <h2 className='rule-head about-sec-label' id='about-elsewhere-title'>
        <span>Elsewhere</span>
              <span className='rule-head-rule' aria-hidden='true' />
      </h2>
      <p className='about-elsewhere-text'>
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
    </section>
  )
}

export default Elsewhere
