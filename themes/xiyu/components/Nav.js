import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import ThemeToggle from './ThemeToggle'

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

  const twitterLink = siteConfig('CONTACT_TWITTER') || siteConfig('XIYU_NAV_TWITTER')

  return (
    <nav className='site-nav'>
      <SmartLink href='/' className='brand'>
        <span className='brand-mark'>
          {siteConfig('AUTHOR') || 'xiyu'}
          <span className='brand-dot'></span>
        </span>
        <span className='brand-tag'>long · bitcoin</span>
      </SmartLink>
      <div className='nav-links'>
        <SmartLink href='/' className={'nav-link' + (active === 'writing' ? ' active' : '')}>写作</SmartLink>
        <SmartLink href='/archive' className={'nav-link' + (active === 'archive' ? ' active' : '')}>归档</SmartLink>
        <SmartLink href='/about' className={'nav-link' + (active === 'about' ? ' active' : '')}>关于</SmartLink>
        {twitterLink && (
          <a href={twitterLink} target='_blank' rel='noopener noreferrer' className='nav-link'>Twitter ↗</a>
        )}
        <ThemeToggle />
      </div>
    </nav>
  )
}

export default Nav
