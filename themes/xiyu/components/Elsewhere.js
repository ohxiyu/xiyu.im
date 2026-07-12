import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

// 关于页 · "Elsewhere" 联系方式（精简版：只保留 Twitter）
const Elsewhere = () => {
  const twitter =
    siteConfig('CONTACT_TWITTER') ||
    siteConfig('XIYU_NAV_TWITTER', '', CONFIG)
  if (!twitter) return null

  const handle = twitter.match(/([^/]+)\/?$/)?.[1]

  return (
    <section className='elsewhere'>
      <h2 className='elsewhere-title'>Elsewhere</h2>
      <div className='link-list'>
        <a
          className='link-row'
          href={twitter}
          target='_blank'
          rel='noopener noreferrer'>
          <span className='link-platform'>Twitter</span>
          <span className='link-handle'>{handle ? `@${handle} →` : 'Twitter →'}</span>
        </a>
      </div>
    </section>
  )
}

export default Elsewhere
