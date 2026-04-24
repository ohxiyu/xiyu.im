import NotionPage from '@/components/NotionPage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useRef } from 'react'
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
import Topics from './components/Topics'
import Colophon from './components/Colophon'

const Comment = dynamic(() => import('@/components/Comment'), { ssr: false })
const ArticleLock = dynamic(() => import('./components/ArticleLock'), { ssr: false })

// 主题全局状态
const ThemeGlobalXiyu = createContext()
export const useXiyuGlobal = () => useContext(ThemeGlobalXiyu)

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
        <div className='page'>
          <Nav {...props} />
          <div style={{ opacity: onLoading ? 0.6 : 1, transition: 'opacity .2s' }}>
            {children}
          </div>
          <Footer {...props} />
        </div>
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
          {rest.map((p, idx) => (
            <BlogPost key={p.id || p.slug} post={p} totalCount={total} index={idx + 1} />
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
  const grouped = archivePosts && typeof archivePosts === 'object' ? archivePosts : {}
  const years = Object.keys(grouped).sort((a, b) => b.localeCompare(a))
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
        <ArchiveYear key={y} year={y} posts={grouped[y]} />
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
 * 独立页面 · slug=about 用定制布局，其它用 NotionPage 渲染
 */
const LayoutPage = props => {
  const { post, tagOptions, postCount } = props
  if (!post) return null
  if (post.slug === 'about') {
    return (
      <>
        <AboutHero />
        <div className='about-body'>
          <NotionPage post={post} />
        </div>
        <AboutFacts postCount={postCount} />
        <Topics tagOptions={tagOptions} />
        <Colophon />
      </>
    )
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
