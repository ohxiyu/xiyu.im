import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

const AboutFooter = ({ postCount, tagCount }) => {
  const since = parseInt(siteConfig('SINCE')) || 2021
  const x = siteConfig('CONTACT_TWITTER') || siteConfig('XIYU_NAV_TWITTER', '', CONFIG)
  const handle = x?.match(/([^/]+)\/?$/)?.[1]

  return (
    <footer className='about-footer'>
      <h2 className='section-title about-sec-label'>找到我</h2>
      <nav className='about-links' aria-label='关于页联系方式'>
        {x && (
          <a href={x} target='_blank' rel='noopener noreferrer' className='inline-link'>
            {handle ? `@${handle}` : 'X'} ↗
          </a>
        )}
        <a href='/feed.xml' className='inline-link'>RSS</a>
        <SmartLink href='/archive' className='inline-link'>归档</SmartLink>
      </nav>
      <p className='about-site-meta'>
        {postCount ?? '—'} 篇文章 · {tagCount ?? '—'} 个主题 · 始于 {since}
      </p>
    </footer>
  )
}

export default AboutFooter
