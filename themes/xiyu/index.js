import NotionPage from '@/components/NotionPage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import CONFIG from './config'
import { Style } from './style'

// —— xiyu 主题组件 ——
import Nav from './components/Nav'
import Footer from './components/Footer'
import Hero from './components/Hero'
import FeaturedCard from './components/FeaturedCard'
import BlogPost from './components/BlogPost'
import TOC from './components/TOC'
import ArticleSide from './components/ArticleSide'
import PrevNext from './components/PrevNext'
import ArchiveYear from './components/ArchiveYear'
import AboutHero from './components/AboutHero'
import AboutFacts from './components/AboutFacts'
import Elsewhere from './components/Elsewhere'
import Topics from './components/Topics'
import Colophon from './components/Colophon'

const Comment = dynamic(() => import('@/components/Comment'), { ssr: false })
const ArticleLock = dynamic(() => import('./components/ArticleLock'), { ssr: false })
const ShareBar = dynamic(() => import('@/components/ShareBar'), { ssr: false })
const AlgoliaSearchModal = dynamic(() => import('@/components/AlgoliaSearchModal'), { ssr: false })

// 主题全局状态
const ThemeGlobalXiyu = createContext()
export const useXiyuGlobal = () => useContext(ThemeGlobalXiyu)

// 右下浮动"回到顶部"按钮
const JumpToTop = () => {
  const [show, setShow] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const onScroll = () => setShow(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  if (!show) return null
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label='回到顶部'
      className='theme-toggle'
      style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 50 }}>
      <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
        <line x1='12' y1='19' x2='12' y2='5' />
        <polyline points='5 12 12 5 19 12' />
      </svg>
    </button>
  )
}

// 首页文章列表按年份分组
const groupByYear = posts => {
  if (!Array.isArray(posts)) return []
  const groups = []
  let currentYear = null
  let currentGroup = null
  for (const post of posts) {
    const year = (post?.publishDay || post?.date?.start_date || '').slice(0, 4)
    if (year !== currentYear) {
      currentYear = year
      currentGroup = { year, posts: [] }
      groups.push(currentGroup)
    }
    currentGroup.posts.push(post)
  }
  return groups
}

/**
 * 全局外壳：.page 容器 + Nav + children + Footer
 */
const LayoutBase = props => {
  const { children } = props
  const { onLoading } = useGlobal() || {}
  const searchModal = useRef(null)
  return (
    <ThemeGlobalXiyu.Provider value={{ searchModal }}>
      <div id='theme-xiyu'>
        <Style />
        <div className='paper-grain' aria-hidden='true' />
        <div className='page'>
          <Nav {...props} />
          <div style={{ opacity: onLoading ? 0.6 : 1, transition: 'opacity .2s' }}>
            {children}
          </div>
          <Footer {...props} />
        </div>
        <JumpToTop />
        <AlgoliaSearchModal cRef={searchModal} {...props} />
      </div>
    </ThemeGlobalXiyu.Provider>
  )
}

/**
 * 首页：Hero + 最新写作 section（FeaturedCard + ArticleRow list + 分页）
 */
const LayoutIndex = props => {
  const { posts, postCount, allNavPages } = props
  const list = Array.isArray(posts) ? posts : []
  const total = typeof postCount === 'number' ? postCount : list.length
  const [featured, ...rest] = list
  const currentYear = new Date().getFullYear()
  const grouped = groupByYear(rest)
  let runningIdx = 1 // featured 占用 idx 0

  return (
    <>
      <Hero posts={list} postCount={total} allNavPages={allNavPages} />
      <section>
        <div className='section-head'>
          <h2 className='section-title'>最新写作</h2>
          <span className='section-count'>{currentYear} · {list.length} posts shown</span>
        </div>
        {featured && <FeaturedCard post={featured} totalCount={total} index={0} />}
        <div>
          {grouped.map(group => (
            <div key={group.year || 'no-year'}>
              {group.year && (
                <h3 className='eyebrow' style={{ margin: '32px 0 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span>{group.year}</span>
                  <span style={{ flex: 1, height: 1, background: 'var(--rule)' }}></span>
                </h3>
              )}
              {group.posts.map(p => {
                const idx = runningIdx++
                return <BlogPost key={p.id || p.slug} post={p} totalCount={total} index={idx} />
              })}
            </div>
          ))}
        </div>
        <LayoutPagination {...props} />
      </section>
    </>
  )
}

/**
 * 通用列表（分类/标签/搜索复用）
 */
const LayoutPostList = props => {
  const { posts, postCount, tag, category, keyword } = props
  const list = Array.isArray(posts) ? posts : []
  const total = typeof postCount === 'number' ? postCount : list.length
  const title = tag ? `# ${tag}` : category ? `分类 · ${category}` : keyword ? `搜索 · ${keyword}` : '文章'
  return (
    <section>
      <div className='section-head'>
        <h2 className='section-title'>{title}</h2>
        <span className='section-count'>{list.length} posts</span>
      </div>
      <div>
        {list.length === 0 && <p style={{ color: 'var(--ink-mute)', padding: '40px 0' }}>还没有文章。</p>}
        {list.map((p, idx) => (
          <BlogPost key={p.id || p.slug} post={p} totalCount={total} index={idx} />
        ))}
      </div>
      <LayoutPagination {...props} />
    </section>
  )
}

/**
 * 分页（内部组件）
 */
const LayoutPagination = ({ page = 1, postCount }) => {
  const router = useRouter()
  const POSTS_PER_PAGE = parseInt(siteConfig('POSTS_PER_PAGE', 12)) || 12
  const totalPage = Math.max(1, Math.ceil((postCount || 0) / POSTS_PER_PAGE))
  const currentPage = +page || 1
  if (totalPage <= 1) return null
  const showPrev = currentPage > 1
  const showNext = currentPage < totalPage
  const prefix = (router?.asPath || '/').split('?')[0].replace(/\/page\/[1-9]\d*/, '').replace(/\/$/, '').replace('.html', '')
  const prevHref = currentPage - 1 === 1 ? `${prefix || ''}/` : `${prefix}/page/${currentPage - 1}`
  const nextHref = `${prefix}/page/${currentPage + 1}`
  return (
    <nav className='pagination'>
      {showPrev ? (
        <SmartLink href={prevHref} className='page-link'>← 更新的文章</SmartLink>
      ) : (
        <span className='page-link disabled'>← 更新的文章</span>
      )}
      <span className='page-indicator'>page {currentPage} / {totalPage}</span>
      {showNext ? (
        <SmartLink href={nextHref} className='page-link'>更早的文章 →</SmartLink>
      ) : (
        <span className='page-link disabled'>更早的文章 →</span>
      )}
    </nav>
  )
}

/**
 * 文章详情：左 TOC · 中正文 · 右 ArticleSide
 */
const LayoutSlug = props => {
  const { post, lock, validPassword, prev, next } = props
  const { fullWidth } = useGlobal() || {}
  const router = useRouter()
  const waiting404 = parseInt(siteConfig('POST_WAITING_TIME_FOR_404') || 0) * 1000

  useEffect(() => {
    if (!post && waiting404) {
      const t = setTimeout(() => {
        if (typeof document !== 'undefined' && !document.querySelector('#article-wrapper #notion-article')) {
          router.push('/404')
        }
      }, waiting404)
      return () => clearTimeout(t)
    }
  }, [post])

  if (lock) return <ArticleLock validPassword={validPassword} />
  if (!post) return null

  // 如果走的是 /about 路径，不管 Notion 这条记录是 Post 还是 Page，都渲染关于页设计稿
  const path = router?.asPath || ''
  if (path === '/about' || path.startsWith('/about?') || path.startsWith('/about/') || path.startsWith('/about.html')) {
    return renderAboutPage(props)
  }

  const rawNum = post?.pageProperties?.num ?? post?.pageProperties?.Num
  const num = rawNum ? String(rawNum).padStart(4, '0') : ''
  const tags = Array.isArray(post.tags) ? post.tags : []
  const dateISO = post.publishDay || post.date?.start_date || ''
  const dateFmt = (() => {
    if (!dateISO) return ''
    const d = new Date(dateISO + 'T00:00:00')
    if (isNaN(d.getTime())) return dateISO
    return `${d.toLocaleString('en-US', { month: 'short' })} ${d.getDate()}, ${d.getFullYear()}`
  })()

  return (
    <div className='article-layout'>
      <TOC toc={post.toc} />
      <article>
        <header className='article-hero'>
          <div className='article-head-meta'>
            {num && <span className='post-num'>#{num}</span>}
            {dateFmt && <span className='post-date'>{dateFmt}</span>}
            {tags.length > 0 && <span className='tag-dot'>·</span>}
            {tags.map((t, i) => (
              <span key={t}>
                {i > 0 && <span className='tag-dot'>·</span>}
                <span className='tag-plain'>{t}</span>
              </span>
            ))}
          </div>
          <h1 className='article-h1'>{post.title}</h1>
          {post.summary && <p className='article-lead'>{post.summary}</p>}
        </header>
        <div id='article-wrapper' className='article-body'>
          <NotionPage post={post} />
        </div>
        <footer className='article-foot'>
          {tags.length > 0 && (
            <div className='article-foot-tags'>
              {tags.map(t => <span key={t} className='tag'>{t}</span>)}
            </div>
          )}
          <ShareBar post={post} />
          <PrevNext prev={prev} next={next} />
        </footer>
        <Comment frontMatter={post} />
      </article>
      <ArticleSide post={post} />
    </div>
  )
}

/**
 * 归档页
 */
const LayoutArchive = props => {
  const { archivePosts, postCount } = props
  const rawGrouped = archivePosts && typeof archivePosts === 'object' ? archivePosts : {}
  // NotionNext 把 archivePosts 按 yyyy-MM 分组；我们需要的是按 yyyy 年二次聚合
  const byYear = {}
  for (const [ym, list] of Object.entries(rawGrouped)) {
    const year = String(ym).slice(0, 4)
    if (!byYear[year]) byYear[year] = []
    byYear[year] = byYear[year].concat(list || [])
  }
  for (const year of Object.keys(byYear)) {
    byYear[year].sort((a, b) => (b?.publishDay || '').localeCompare(a?.publishDay || ''))
  }
  const years = Object.keys(byYear).sort((a, b) => b.localeCompare(a))
  const author = siteConfig('AUTHOR') || 'xiyu'
  const since = parseInt(siteConfig('SINCE')) || new Date().getFullYear()
  const years_writing = Math.max(1, new Date().getFullYear() - since + 1)
  return (
    <>
      <header className='archive-head'>
        <div className='eyebrow'>Archive · {years_writing} 年的文字</div>
        <h1 className='archive-title'>所有写过的字，按年陈列。</h1>
        <p className='archive-sub'>
          从 {since} 到现在，一共 {postCount || 0} 篇文章。早期的幼稚和近年的克制，都在这里——{author} 不删旧文，因为那也是我。
        </p>
      </header>
      {years.map(y => (
        <ArchiveYear key={y} year={y} posts={byYear[y]} />
      ))}
    </>
  )
}

/**
 * 搜索 / 分类 / 标签 · 复用 LayoutPostList
 */
const LayoutSearch = props => <LayoutPostList {...props} />

const LayoutCategoryIndex = props => {
  const { categoryOptions } = props
  const list = Array.isArray(categoryOptions) ? categoryOptions : []
  return (
    <section>
      <div className='section-head'>
        <h2 className='section-title'>Categories · 分类</h2>
        <span className='section-count'>{list.length} categories</span>
      </div>
      <div className='topics-grid'>
        {list.map(c => (
          <SmartLink key={c.name} href={`/category/${encodeURIComponent(c.name)}`} className='topic-cell'>
            <span className='topic-name'>{c.name}</span>
            <span className='topic-count'>{c.count} posts</span>
          </SmartLink>
        ))}
      </div>
    </section>
  )
}

const LayoutTagIndex = props => {
  const { tagOptions } = props
  const list = Array.isArray(tagOptions) ? tagOptions : []
  return (
    <section>
      <div className='section-head'>
        <h2 className='section-title'>Tags · 标签</h2>
        <span className='section-count'>{list.length} tags</span>
      </div>
      <div className='topics-grid'>
        {list.map(t => (
          <SmartLink key={t.name} href={`/tag/${encodeURIComponent(t.name)}`} className='topic-cell'>
            <span className='topic-name'>{t.name}</span>
            <span className='topic-count'>{t.count} posts</span>
          </SmartLink>
        ))}
      </div>
    </section>
  )
}

/**
 * 独立页面 · slug=about 或 /about 路径用定制布局，其它用 NotionPage 渲染
 */
const renderAboutPage = props => {
  const { tagOptions, postCount } = props
  const since = parseInt(siteConfig('SINCE')) || 2013
  const years = Math.max(1, new Date().getFullYear() - since + 1)
  const bitcoinYears = parseInt(siteConfig('XIYU_BITCOIN_YEARS', 7, CONFIG)) || 7
  return (
    <>
      <AboutHero />
      <div className='about-body'>
        <p>
          我从 {since} 年开始写博客，到今天是第 {years} 年。最早写的是技术笔记，
          后来慢慢变成投资思考、AI 实验、生活观察的混合体。
          <strong>这里不是一个内容产品，它是我的公开思考档案</strong>——
          我写给三年后的自己看，顺便让愿意陪我读的人进来坐坐。
        </p>
        <p>
          我在币圈待了快 {bitcoinYears} 年。2017 年冲过 ICO，2021 年追过 NFT，中间还玩过合约、做过网格、研究过各种山寨。
          回头看，最大的教训不是买错了哪个币，而是——<strong>我根本就不该"炒"</strong>。
          现在我只做一件事：<em>长期持有比特币，观察市场，不参与，不预测。</em>
        </p>
        <p>
          近两年我把大部分精力放在 AI Agent 上。做了一个叫 OpenClaw 的开源框架，
          让非程序员也能搭一个 7×24 小时替自己干活的数字助理。
          它替我处理邮件、写交易报告、盯盘、做周报——<strong>我做减法，它做加法</strong>。
        </p>
      </div>
      <AboutFacts postCount={postCount} />
      <div className='about-body'>
        <p>
          如果你也在长期持有比特币，或者在折腾 AI Agent，或者只是喜欢一些反直觉的思考——
          欢迎通过下面的链接找我。我尽量回每一封邮件，不保证立刻。
        </p>
      </div>
      <Elsewhere />
      <Topics tagOptions={tagOptions} />
      <Colophon />
    </>
  )
}

const LayoutPage = props => {
  const { post } = props
  if (!post) return null
  if (post.slug === 'about') {
    return renderAboutPage(props)
  }
  return (
    <article>
      <header className='article-hero'>
        <h1 className='article-h1'>{post.title}</h1>
        {post.summary && <p className='article-lead'>{post.summary}</p>}
      </header>
      <div className='article-body'>
        <NotionPage post={post} />
      </div>
    </article>
  )
}

/**
 * 404
 */
const Layout404 = () => (
  <section style={{ padding: '120px 0', textAlign: 'center' }}>
    <div className='eyebrow' style={{ justifyContent: 'center' }}>404 · 页面未找到</div>
    <h1 className='archive-title' style={{ margin: '24px 0 16px' }}>迷路了？</h1>
    <p className='archive-sub' style={{ margin: '0 auto 32px', maxWidth: '40ch' }}>
      这里没有你要找的内容。也许它已经被我删了，也许从来就没存在过。
    </p>
    <SmartLink href='/' className='btn-ghost'>← 回首页</SmartLink>
  </section>
)

export {
  CONFIG as THEME_CONFIG,
  LayoutBase,
  LayoutIndex,
  LayoutPostList,
  LayoutSlug,
  LayoutArchive,
  LayoutSearch,
  LayoutCategoryIndex,
  LayoutTagIndex,
  LayoutPage,
  Layout404
}
