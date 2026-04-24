import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import ThemeToggle from './ThemeToggle'
import { useXiyuGlobal } from '..'
import CONFIG from '../config'

// xiyu 主题顶部导航（对应 .design/source/shared.jsx 的 SiteNav）
const Nav = props => {
  const router = useRouter()
  const path = router?.asPath || '/'
  const active = path.startsWith('/archive')
    ? 'archive'
    : path.startsWith('/about')
      ? 'about'
      : path === '/' || path.startsWith('/page') || path.startsWith('/category') || path.startsWith('/tag') || path.startsWith('/search')
        ? 'writing'
        : ''

  const twitterLink =
    siteConfig('CONTACT_TWITTER') ||
    siteConfig('XIYU_NAV_TWITTER', '', CONFIG)

  const xiyu = useXiyuGlobal?.() || {}
  const openSearch = () => {
    if (siteConfig('ALGOLIA_APP_ID')) {
      xiyu.searchModal?.current?.openSearch?.()
    } else {
      router.push('/search')
    }
  }

  return (
    <nav className='site-nav'>
      <SmartLink href='/' className='brand'>
        <span className='brand-mark'>
          {siteConfig('AUTHOR') || 'xiyu'}
          <span className='brand-dot'></span>
        </span>
        <span className='brand-tag'>{siteConfig('XIYU_NAV_TAGLINE', 'long · bitcoin', CONFIG)}</span>
      </SmartLink>
      <div className='nav-links'>
        <SmartLink href='/' className={'nav-link' + (active === 'writing' ? ' active' : '')}>写作</SmartLink>
        <SmartLink href='/archive' className={'nav-link' + (active === 'archive' ? ' active' : '')}>归档</SmartLink>
        <SmartLink href='/about' className={'nav-link' + (active === 'about' ? ' active' : '')}>关于</SmartLink>
        {twitterLink && (
          <a href={twitterLink} target='_blank' rel='noopener noreferrer' className='nav-link'>Twitter ↗</a>
        )}
        <button className='theme-toggle' onClick={openSearch} aria-label='搜索'>
          <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
            <circle cx='11' cy='11' r='7' />
            <line x1='21' y1='21' x2='16.65' y2='16.65' />
          </svg>
        </button>
        <ThemeToggle />
      </div>
    </nav>
  )
}

export default Nav
