import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * 导航栏的 X 图标，点击去作者的 X 主页。
 *
 * 取代原先的 EN 语言切换按钮——那个按钮依赖第三方翻译 SDK，
 * 机器翻译质量不可控，且要外挂两个 CDN。
 *
 * 复用 .theme-toggle 的外观，和旁边的主题切换按钮保持同一尺寸与圆角。
 */
const XLink = () => {
  const href =
    siteConfig('CONTACT_TWITTER') || siteConfig('XIYU_NAV_TWITTER', '', CONFIG)

  if (!href) return null

  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className='theme-toggle'
      aria-label='在 X 上关注作者'
      title='X'>
      <svg
        width='14'
        height='14'
        viewBox='0 0 24 24'
        fill='currentColor'
        aria-hidden='true'>
        <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
      </svg>
    </a>
  )
}

export default XLink
