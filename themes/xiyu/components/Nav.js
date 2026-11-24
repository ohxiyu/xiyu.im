import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { useEffect, useRef } from 'react'
import ThemeToggle from './ThemeToggle'
import XLink from './XLink'
import CONFIG from '../config'

/*
 * 导航的 class（.xn-*）和样式表 /css/site-nav.css 与 /xiyu999.html 共用，
 * 两边的结构要保持一致：改这里时同步改 public/xiyu999.html 里的 <nav class="xn">。
 * 搜索面板由 /js/site-search.js 提供（两边同一份），点 data-xn-search 或 ⌘K 打开。
 */

const LINKS = [
  { key: 'writing', href: '/', label: '写作' },
  { key: 'archive', href: '/archive', label: '归档' },
  { key: 'about', href: '/about', label: '关于' },
  // xiyu999 是 public/ 下的独立静态页，不走 Next 路由，用普通 <a> 整页跳转
  { key: 'xiyu999', href: '/xiyu999.html', label: 'xiyu999', native: true }
]

const SearchIcon = () => (
  <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' aria-hidden='true'>
    <circle cx='11' cy='11' r='7' />
    <path d='m20 20-3.5-3.5' />
  </svg>
)

const NavLink = ({ link, active, className, children }) => {
  const current = active === link.key ? 'page' : undefined
  return link.native
    ? <a href={link.href} className={className} aria-current={current}>{children}</a>
    : <SmartLink href={link.href} className={className} aria-current={current}>{children}</SmartLink>
}

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


  // 导航是比特币橙色带，深浅色模式下底色都不变，所以一直用墨黑那版 logo
  const logo = siteConfig('BLOG_LOGO') || '/images/logo/logo-mark.svg'
  const author = siteConfig('AUTHOR') || 'xiyu'
  // 留空就自动跟着 SINCE 走（2013 = 入行那年），不用两处维护同一个年份
  const since = parseInt(siteConfig('SINCE')) || new Date().getFullYear()
  const tagline =
    String(siteConfig('XIYU_NAV_TAGLINE', '', CONFIG) || '').trim() ||
    `since ${since}`

  const drawer = useRef(null)
  const openMenu = () => drawer.current?.showModal?.()
  const closeMenu = () => drawer.current?.close?.()
  // 路由变化后收起菜单
  useEffect(() => closeMenu(), [path])

  return (
    <>
      <nav className='xn' aria-label='主导航'>
        <div className='xn-in'>
          <div className='xn-bar'>
            <SmartLink href='/' className='xn-brand'>
              {logo && <img src={logo} width={32} height={32} alt='' className='xn-logo' />}
              <b className='xn-mark'>{author}</b>
              <span className='xn-tag'>{tagline}</span>
            </SmartLink>
            <div className='xn-right'>
              <div className='xn-links'>
                {LINKS.map(link => (
                  <NavLink key={link.key} link={link} active={active} className='xn-link'>
                    {link.label}
                  </NavLink>
                ))}
              </div>
              <div className='xn-tools'>
                <button type='button' className='xn-search' data-xn-search aria-label='搜索文章'>
                  <SearchIcon />
                  <span className='xn-search-label'>搜索</span>
                  <kbd className='xn-kbd' aria-hidden='true'>⌘K</kbd>
                </button>
                <ThemeToggle className='xn-icon xn-desk' />
                <XLink className='xn-icon xn-desk' />
                <button type='button' className='xn-icon xn-menu' aria-label='打开菜单' aria-haspopup='dialog' onClick={openMenu}>
                  <svg width='17' height='17' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' aria-hidden='true'>
                    <path d='M4 7h16M4 12h16M4 17h16' />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <dialog
        ref={drawer}
        className='xn-drawer'
        aria-label='菜单'
        onClick={e => e.target === drawer.current && closeMenu()}>
        <div className='xn-dh'>
          <b>菜单</b>
          <button type='button' className='xn-icon' aria-label='关闭菜单' onClick={closeMenu}>
            <svg width='17' height='17' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' aria-hidden='true'>
              <path d='m6 6 12 12M18 6 6 18' />
            </svg>
          </button>
        </div>
        <nav className='xn-dnav' aria-label='站点主导航'>
          {LINKS.map((link, i) => (
            <NavLink key={link.key} link={link} active={active}>
              <i>{String(i + 1).padStart(2, '0')}</i>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className='xn-dt'>
          <ThemeToggle />
          <XLink />
        </div>
      </dialog>

      <Script src='/js/site-search.js' strategy='afterInteractive' />
    </>
  )
}

export default Nav
