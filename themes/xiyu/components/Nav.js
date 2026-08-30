import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import ThemeToggle from './ThemeToggle'
import LangToggle from './LangToggle'
import CONFIG from '../config'
import { useEffect, useState } from 'react'

const NavIcon = ({ name }) => {
  const common = {
    width: 15,
    height: 15,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true
  }

  if (name === 'writing') {
    return (
      <svg {...common}>
        <path d='M4 20l4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z' />
        <path d='m14.5 7.5 3 3' />
      </svg>
    )
  }
  if (name === 'archive') {
    return (
      <svg {...common}>
        <path d='M4 7h16v13H4z' />
        <path d='M3 4h18v3H3zM9 11h6' />
      </svg>
    )
  }
  if (name === 'about') {
    return (
      <svg {...common}>
        <circle cx='12' cy='8' r='3' />
        <path d='M5.5 20a6.5 6.5 0 0 1 13 0' />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <path d='M7 17 17 7M8 7h9v9' />
    </svg>
  )
}

// xiyu 主题顶部导航（对应 .design/source/shared.jsx 的 SiteNav）
const Nav = props => {
  const router = useRouter()
  const { isDarkMode } = useGlobal() || {}
  const path = router?.asPath || '/'
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => setMenuOpen(false), [path])

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

  const lightLogo = siteConfig('BLOG_LOGO') || '/images/logo/logo-mark.svg'
  const darkLogo = siteConfig('BLOG_LOGO_DARK') || '/images/logo/logo-mark-dark.svg'
  const logo = isDarkMode ? darkLogo : lightLogo
  const author = siteConfig('AUTHOR') || 'xiyu'

  return (
    <nav className='site-nav' aria-label='主导航'>
      <SmartLink href='/' className='brand'>
        {logo && (
          <img
            src={logo}
            width={32}
            height={32}
            alt={author}
            className='brand-logo'
          />
        )}
        <span className='brand-mark'>
          {author}
          <span className='brand-dot'></span>
        </span>
        <span className='brand-tag'>{siteConfig('XIYU_NAV_TAGLINE', 'long · bitcoin', CONFIG)}</span>
      </SmartLink>
      <div className='nav-links'>
        <div
          id='xiyu-primary-navigation'
          className={`nav-primary${menuOpen ? ' is-open' : ''}`}>
          <SmartLink href='/' className={'nav-link' + (active === 'writing' ? ' active' : '')}>
            <NavIcon name='writing' />
            <span className='nav-link-label'>写作</span>
          </SmartLink>
          <SmartLink href='/archive' className={'nav-link' + (active === 'archive' ? ' active' : '')}>
            <NavIcon name='archive' />
            <span className='nav-link-label'>归档</span>
          </SmartLink>
          <SmartLink href='/about' className={'nav-link' + (active === 'about' ? ' active' : '')}>
            <NavIcon name='about' />
            <span className='nav-link-label'>关于</span>
          </SmartLink>
          {twitterLink && (
            <a
              href={twitterLink}
              target='_blank'
              rel='noopener noreferrer'
              className='nav-link nav-link-external'
              aria-label='在 Twitter 上关注 xiyu'>
              <NavIcon name='external' />
              <span className='nav-link-label'>Twitter</span>
            </a>
          )}
          <div className='nav-mobile-tools'>
            <ThemeToggle />
            <LangToggle />
          </div>
        </div>
        <SmartLink href='/search' className='theme-toggle nav-search' aria-label='搜索文章'>
          <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
            <circle cx='11' cy='11' r='7' />
            <line x1='21' y1='21' x2='16.65' y2='16.65' />
          </svg>
        </SmartLink>
        <div className='nav-desktop-tools'>
          <ThemeToggle />
          <LangToggle />
        </div>
        <button
          type='button'
          className='theme-toggle nav-menu-toggle'
          aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
          aria-expanded={menuOpen}
          aria-controls='xiyu-primary-navigation'
          onClick={() => setMenuOpen(open => !open)}>
          {menuOpen
            ? (
                <svg width='17' height='17' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' aria-hidden='true'>
                  <path d='m6 6 12 12M18 6 6 18' />
                </svg>
              )
            : (
                <svg width='17' height='17' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' aria-hidden='true'>
                  <path d='M5 7h14M5 12h14M5 17h14' />
                </svg>
              )}
        </button>
      </div>
    </nav>
  )
}

export default Nav
