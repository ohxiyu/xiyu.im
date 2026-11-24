import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import ThemeToggle from './ThemeToggle'
import XLink from './XLink'
import CONFIG from '../config'
import CommandPalette from '@/components/ui/CommandPalette'
import MobileNav from '@/components/ui/MobileNav'

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
  if (name === 'index') {
    return (
      <svg {...common}>
        <path d='M4 20h16' />
        <path d='m5 15 4-4 3 3 7-7' />
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
  const { allNavPages } = props || {}
  const router = useRouter()
  const path = router?.asPath || '/'
  const active = path.startsWith('/archive')
    ? 'archive'
    : path.startsWith('/about')
      ? 'about'
      : path === '/' || path.startsWith('/page') || path.startsWith('/category') || path.startsWith('/tag') || path.startsWith('/search')
        ? 'writing'
        : ''


  // 导航是比特币橙色带，深浅色模式下底色都不变，所以一直用墨黑那版 logo
  const logo = siteConfig('BLOG_LOGO') || '/images/logo/logo-mark.svg'
  const author = siteConfig('AUTHOR') || 'xiyu'
  // 留空就自动跟着 SINCE 走（2013 = 入行那年），不用两处维护同一个年份
  const since = parseInt(siteConfig('SINCE')) || new Date().getFullYear()
  const tagline =
    String(siteConfig('XIYU_NAV_TAGLINE', '', CONFIG) || '').trim() ||
    `since ${since}`

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
        <span className='brand-tag'>{tagline}</span>
      </SmartLink>
      <div className='nav-links'>
        <div
          id='xiyu-primary-navigation'
          className='nav-primary'>
          <SmartLink href='/' aria-current={active === 'writing' ? 'page' : undefined} className={'nav-link' + (active === 'writing' ? ' active' : '')}>
            <NavIcon name='writing' />
            <span className='nav-link-label'>写作</span>
          </SmartLink>
          <SmartLink href='/archive' aria-current={active === 'archive' ? 'page' : undefined} className={'nav-link' + (active === 'archive' ? ' active' : '')}>
            <NavIcon name='archive' />
            <span className='nav-link-label'>归档</span>
          </SmartLink>
          <SmartLink href='/about' aria-current={active === 'about' ? 'page' : undefined} className={'nav-link' + (active === 'about' ? ' active' : '')}>
            <NavIcon name='about' />
            <span className='nav-link-label'>关于</span>
          </SmartLink>
          {/* xiyu999 是 public/ 下的独立静态页，不走 Next 路由，用普通 <a> 整页跳转 */}
          <a href='/xiyu999.html' className='nav-link'>
            <NavIcon name='index' />
            <span className='nav-link-label'>xiyu999</span>
          </a>
        </div>
        <CommandPalette posts={allNavPages} />
        <div className='nav-desktop-tools'>
          <ThemeToggle />
          <XLink />
        </div>
        <MobileNav
          links={[
            { key: 'writing', href: '/', label: '写作' },
            { key: 'archive', href: '/archive', label: '归档' },
            { key: 'about', href: '/about', label: '关于' },
            { key: 'xiyu999', href: '/xiyu999.html', label: 'xiyu999', native: true }
          ]}
          tools={<><ThemeToggle /><XLink /></>}
        />
      </div>
    </nav>
  )
}

export default Nav
