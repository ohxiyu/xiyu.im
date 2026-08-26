import NotionPage from '@/components/NotionPage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { formatNum, formatDateEN } from './lib/format'
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import CONFIG from './config'
import { Style } from './style'
import { agenticPages } from '@/lib/agentic/content'

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
import PostCover from './components/PostCover'
import ShareActions from './components/ShareActions'
import {
  getPostCategories,
  getPostCover,
  getPostReadingTime,
  matchesPost
} from './lib/post'

const Comment = dynamic(() => import('@/components/Comment'), { ssr: false })
const ArticleLock = dynamic(() => import('./components/ArticleLock'), { ssr: false })
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

const DiscoverySidebar = ({
  categories = [],
  activeCategory = '',
  onCategoryChange,
  years = [],
  activeYear = '',
  onYearChange
}) => (
  <aside className='discovery-sidebar' aria-label='内容筛选'>
    <div className='discovery-filter-group'>
      <div className='discovery-filter-label'>Topics · 分类</div>
      <button
        type='button'
        className={`discovery-filter${activeCategory ? '' : ' active'}`}
        aria-pressed={!activeCategory}
        onClick={() => onCategoryChange?.('')}>
        <span>全部文章</span>
      </button>
      {categories.map(item => (
        <button
          type='button'
          key={item.name}
          className={`discovery-filter${activeCategory === item.name ? ' active' : ''}`}
          aria-pressed={activeCategory === item.name}
          onClick={() => onCategoryChange?.(item.name)}>
          <span>{item.name}</span>
          {Number.isFinite(Number(item.count)) && <small>{item.count}</small>}
        </button>
      ))}
    </div>
    {years.length > 0 && (
      <div className='discovery-filter-group discovery-years'>
        <div className='discovery-filter-label'>Years · 年份</div>
        <button
          type='button'
          className={`discovery-filter${activeYear ? '' : ' active'}`}
          aria-pressed={!activeYear}
          onClick={() => onYearChange?.('')}>
          <span>全部年份</span>
        </button>
        {years.map(year => (
          <button
            type='button'
            key={year}
            className={`discovery-filter${activeYear === year ? ' active' : ''}`}
            aria-pressed={activeYear === year}
            onClick={() => onYearChange?.(year)}>
            <span>{year}</span>
          </button>
        ))}
      </div>
    )}
  </aside>
)

const DiscoverySearch = ({ value, onChange, onSubmit, placeholder, label = '搜索文章' }) => (
  <form className='discovery-search' onSubmit={onSubmit} role='search'>
    <label htmlFor='xiyu-discovery-search' className='sr-only'>{label}</label>
    <svg width='17' height='17' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' aria-hidden='true'>
      <circle cx='11' cy='11' r='7' />
      <line x1='21' y1='21' x2='16.65' y2='16.65' />
    </svg>
    <input
      id='xiyu-discovery-search'
      type='search'
      value={value}
      onChange={event => onChange?.(event.target.value)}
      placeholder={placeholder}
    />
  </form>
)

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
  const [featured] = list
  const currentYear = new Date().getFullYear()
  // 全部文章（含 featured）一起按年份分组：featured 与同年文章归入同一「年份」标题下，
  // 不再游离于分隔线之外。featured 用 index 0 大卡渲染，其余用 BlogPost 行。
  const grouped = groupByYear(list)

  return (
    <>
      <Hero
        posts={list}
        postCount={total}
        allNavPages={allNavPages}
        heroPickedIdx={props.heroPickedIdx}
        heroPoolSize={props.heroPoolSize}
      />
      <section>
        <div className='section-head'>
          <h2 className='section-title'>最新写作</h2>
          <span className='section-count'>{currentYear} · {list.length} posts shown</span>
        </div>
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
                const idx = list.indexOf(p)
                return p === featured
                  ? <FeaturedCard key={p.id || p.slug} post={p} totalCount={total} index={0} />
                  : <BlogPost key={p.id || p.slug} post={p} totalCount={total} index={idx} />
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
  const { posts, postCount, tag, category, keyword, page = 1 } = props
  const list = Array.isArray(posts) ? posts : []
  const total = typeof postCount === 'number' ? postCount : list.length
  const title = tag ? `# ${tag}` : category ? `分类 · ${category}` : keyword ? `搜索 · ${keyword}` : '文章'
  const POSTS_PER_PAGE = parseInt(siteConfig('POSTS_PER_PAGE', 12)) || 12
  // 全局 idx：前几页累计 + 当前页内 idx，保证 BlogPost.formatNum(total - idx) 跨页连续
  const startIdx = (Math.max(1, +page) - 1) * POSTS_PER_PAGE
  return (
    <section>
      <div className='section-head'>
        <h2 className='section-title'>{title}</h2>
        <span className='section-count'>{list.length} posts</span>
      </div>
      <div>
        {list.length === 0 && <p style={{ color: 'var(--ink-mute)', padding: '40px 0' }}>还没有文章。</p>}
        {list.map((p, idx) => (
          <BlogPost key={p.id || p.slug} post={p} totalCount={total} index={startIdx + idx} />
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
    <nav className='pagination' aria-label='分页导航'>
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
  }, [post, router, waiting404])

  if (lock) return <ArticleLock validPassword={validPassword} />
  if (!post) return null

  // 如果走的是 /about 路径，不管 Notion 这条记录是 Post 还是 Page，都渲染关于页设计稿
  const path = router?.asPath || ''
  if (path === '/about' || path.startsWith('/about?') || path.startsWith('/about/') || path.startsWith('/about.html')) {
    return renderAboutPage(props)
  }

  const num = formatNum(post)
  const tags = Array.isArray(post.tags) ? post.tags : []
  const dateFmt = formatDateEN(post.publishDay || post.date?.start_date || '')
  const modifiedDate = String(post.lastEditedDay || post.lastEditedTime || post.lastEditedDate || '').slice(0, 10)
  const modifiedFmt = formatDateEN(modifiedDate)
  const readTime = getPostReadingTime(post)
  const cover = getPostCover(post)
  const wasUpdated = Boolean(modifiedFmt && modifiedFmt !== dateFmt)

  return (
    <div className='article-layout'>
      <TOC toc={post.toc} />
      <article>
        <header className={`article-hero ${cover ? 'has-cover' : 'is-text-only'}`}>
          <SmartLink href='/' className='article-back'>
            <span aria-hidden='true'>←</span> 返回写作
          </SmartLink>
          <div className='article-head-meta'>
            {num && <span className='post-num'>#{num}</span>}
            {dateFmt && <span className='post-date'>{dateFmt}</span>}
            {readTime && <span className='post-read-time'>{readTime} min read</span>}
            {wasUpdated && <span className='post-updated'>更新于 {modifiedFmt}</span>}
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
          {cover && <PostCover post={post} variant='article' eager linked={false} />}
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
          <div className='article-mobile-share'>
            <span className='side-stat-label'>Share</span>
            <ShareActions post={post} />
          </div>
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
  const rawGrouped = useMemo(
    () => archivePosts && typeof archivePosts === 'object' ? archivePosts : {},
    [archivePosts]
  )
  const [input, setInput] = useState('')
  const [activeCategory, setActiveCategory] = useState('')
  const [activeYear, setActiveYear] = useState('')
  const allPosts = useMemo(() => {
    const seen = new Set()
    return Object.values(rawGrouped)
      .flatMap(list => Array.isArray(list) ? list : [])
      .filter(post => {
        const key = post?.id || post?.slug
        if (!key || seen.has(key)) return false
        seen.add(key)
        return true
      })
      .sort((a, b) => (b?.publishDay || '').localeCompare(a?.publishDay || ''))
  }, [rawGrouped])
  const categories = useMemo(() => {
    const counts = new Map()
    allPosts.forEach(post => {
      getPostCategories(post).forEach(name => counts.set(name, (counts.get(name) || 0) + 1))
    })
    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
  }, [allPosts])
  const years = useMemo(() => [...new Set(allPosts
    .map(post => (post?.publishDay || post?.date?.start_date || '').slice(0, 4))
    .filter(Boolean))].sort((a, b) => b.localeCompare(a)), [allPosts])
  const tokens = useMemo(() => input.trim().toLowerCase().split(/\s+/).filter(Boolean), [input])
  const filtered = useMemo(() => allPosts.filter(post => matchesPost(post, {
    tokens,
    category: activeCategory,
    year: activeYear
  })), [allPosts, tokens, activeCategory, activeYear])
  const filteredByYear = useMemo(() => groupByYear(filtered), [filtered])
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
      <div className='discovery-layout'>
        <DiscoverySidebar
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          years={years}
          activeYear={activeYear}
          onYearChange={setActiveYear}
        />
        <div className='discovery-main'>
          <DiscoverySearch
            value={input}
            onChange={setInput}
            onSubmit={event => event.preventDefault()}
            placeholder='搜索标题、摘要、标签或分类…'
          />
          <div className='discovery-result-meta' aria-live='polite'>
            <span>{filtered.length} 篇文章</span>
            {(input || activeCategory || activeYear) && (
              <button
                type='button'
                onClick={() => {
                  setInput('')
                  setActiveCategory('')
                  setActiveYear('')
                }}>
                清除筛选
              </button>
            )}
          </div>
          {filtered.length === 0
            ? <p className='discovery-empty'>没有匹配结果，换一个关键词或分类试试。</p>
            : filteredByYear.map(group => (
                <ArchiveYear key={group.year || 'no-year'} year={group.year} posts={group.posts} />
              ))}
        </div>
      </div>
    </>
  )
}

/**
 * 搜索 · 客户端实时过滤
 * - 输入即过滤，无需回车 / 跳页
 * - 字段：title + summary + tags + category（数组/字符串都兼容）
 * - 大小写不敏感
 */
const LayoutSearch = props => {
  const router = useRouter()
  const initialKeyword = (router?.query?.s || '').toString()
  const [input, setInput] = useState(initialKeyword)
  const [activeCategory, setActiveCategory] = useState('')

  // 路由变了同步 input
  useEffect(() => { setInput(initialKeyword) }, [initialKeyword])

  // pages/search 把 props.posts 设为按 ?s 过滤后的结果，
  // 但我们用 input 实时过滤，需要拿原始全量列表。
  // props.allPages 在 processPostData 里被 delete 了，retry 用 latestPosts 兜底；
  // 实在没全量就退回 props.posts（至少是按 URL 关键词过滤的）。
  const allList = useMemo(() => {
    const candidates = [
      props.allPosts,           // 自定义传入
      props.allPages,           // 偶尔保留
      props.latestPosts,        // 总是有
      props.posts               // 兜底
    ]
    for (const c of candidates) {
      if (Array.isArray(c) && c.length > 0) return c
    }
    return []
  }, [props.allPosts, props.allPages, props.latestPosts, props.posts])

  const tokens = useMemo(() => (input || '').trim().toLowerCase().split(/\s+/).filter(Boolean), [input])

  const categories = useMemo(() => {
    if (Array.isArray(props.categoryOptions) && props.categoryOptions.length > 0) {
      return props.categoryOptions
    }
    const counts = new Map()
    allList.forEach(post => getPostCategories(post).forEach(name => {
      counts.set(name, (counts.get(name) || 0) + 1)
    }))
    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
  }, [allList, props.categoryOptions])

  const filtered = useMemo(() => {
    if (!tokens.length && !activeCategory) return []
    return allList.filter(p => {
      if (!p) return false
      // 只搜已发布的 Post（避免菜单 / 草稿 / Notice 进结果）
      if (p.type && p.type !== 'Post') return false
      if (p.status && p.status !== 'Published') return false
      return matchesPost(p, { tokens, category: activeCategory })
    })
  }, [allList, tokens, activeCategory])

  // 同步 URL（不重新拉数据，只 shallow push 让浏览器记住搜索词，便于分享/回退）
  const onSubmit = e => {
    e.preventDefault()
    const v = (input || '').trim()
    const url = v ? `/search?s=${encodeURIComponent(v)}` : '/search'
    router.push(url, undefined, { shallow: true })
  }

  return (
    <section>
      <header className='archive-head search-head'>
        <div className='eyebrow'>Search · 搜索</div>
        <h1 className='archive-title'>在旧文章里，重新找到一条线索。</h1>
        <p className='archive-sub'>按关键词和分类交叉筛选。标题、摘要、标签和分类都会参与匹配。</p>
      </header>
      <div className='discovery-layout search-discovery'>
        <DiscoverySidebar
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        <div className='discovery-main'>
          <DiscoverySearch
            value={input}
            onChange={setInput}
            onSubmit={onSubmit}
            placeholder='输入关键词，立即筛选…'
          />
          <div className='discovery-result-meta' aria-live='polite'>
            <span>{tokens.length || activeCategory ? `${filtered.length} 篇结果` : '等待输入'}</span>
            {(input || activeCategory) && (
              <button
                type='button'
                onClick={() => {
                  setInput('')
                  setActiveCategory('')
                  router.push('/search', undefined, { shallow: true })
                }}>
                清除筛选
              </button>
            )}
          </div>
          {!tokens.length && !activeCategory
            ? <p className='discovery-empty'>输入关键词，或直接选择一个分类开始浏览。</p>
            : filtered.length === 0
              ? <p className='discovery-empty'>没有匹配结果，试试更短的关键词。</p>
              : (
                  <div>
                    {filtered.map((p, idx) => (
                      <BlogPost key={p.id || p.slug} post={p} totalCount={filtered.length} index={idx} />
                    ))}
                  </div>
                )}
        </div>
      </div>
    </section>
  )
}

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

// 从 Notion about 页的 blockMap 抽纯文本段落（只取 text block，跳过图片/标题/嵌入）
// 你在 Notion 里改 about 页正文 → 60 秒后这里自动更新，不用动代码
const extractAboutParagraphs = post => {
  try {
    const blocks = post?.blockMap?.block
    if (!blocks || !post?.id) return []
    const root = blocks[post.id]?.value
    const ids = root?.content || []
    const paras = []
    for (const id of ids) {
      const b = blocks[id]?.value
      if (!b || b.type !== 'text') continue
      const title = b.properties?.title
      if (!Array.isArray(title)) continue
      const text = title.map(t => String(t?.[0] ?? '')).join('').trim()
      if (text) paras.push(text)
    }
    return paras
  } catch (e) {
    console.warn('[about] extract paragraphs failed:', e?.message || e)
    return []
  }
}

const EditorialSections = ({ page, startIndex = 1 }) => (
  <div className='editorial-sections'>
    {page.sections.map((section, sectionIndex) => (
      <section
        className='editorial-section'
        aria-labelledby={`editorial-${startIndex + sectionIndex}`}
        key={section.heading}>
        <div className='about-section-label'>
          <span className='about-section-index'>
            {String(startIndex + sectionIndex).padStart(2, '0')}
          </span>
          <h2 id={`editorial-${startIndex + sectionIndex}`}>
            {section.heading}
          </h2>
        </div>
        <div className='about-body'>
          {section.paragraphs.map((paragraph, paragraphIndex) => (
            <p key={paragraphIndex}>{paragraph}</p>
          ))}
        </div>
      </section>
    ))}
  </div>
)

const ResourceLinks = ({ links }) => {
  if (!links?.length) return null

  return (
    <section className='info-resources' aria-labelledby='resource-links-title'>
      <div className='info-resource-heading'>
        <span className='eyebrow'>Direct links</span>
        <h2 id='resource-links-title'>可直接使用的入口</h2>
      </div>
      <div className='info-resource-list'>
        {links.map(link => {
          const content = (
            <>
              <span>{link.label}</span>
              <small>{link.note}</small>
            </>
          )
          return link.href.startsWith('http')
            ? (
                <a
                  key={link.href}
                  href={link.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='info-resource-link'>
                  {content}
                </a>
              )
            : (
                <SmartLink
                  key={link.href}
                  href={link.href}
                  className='info-resource-link'>
                  {content}
                </SmartLink>
              )
        })}
      </div>
    </section>
  )
}

const renderAboutPage = props => {
  const { post, postCount, tagOptions } = props
  const since = parseInt(siteConfig('SINCE')) || 2013
  const years = Math.max(1, new Date().getFullYear() - since + 1)
  const bitcoinYears = parseInt(siteConfig('XIYU_BITCOIN_YEARS', 7, CONFIG)) || 7

  // 正文优先用 Notion about 页的段落；抽不到时回退默认文案
  const notionParas = extractAboutParagraphs(post)
  const fallbackParas = [
    `我从 ${since} 年开始写博客，到今天是第 ${years} 年。最早写的是技术笔记，后来慢慢变成投资思考、AI 实验、生活观察的混合体。这里不是一个内容产品，它是我的公开思考档案——我写给三年后的自己看，顺便让愿意陪我读的人进来坐坐。`,
    `我在币圈待了快 ${bitcoinYears} 年。回头看，最大的教训不是买错了哪个币，而是——我根本就不该"炒"。现在我只做一件事：长期持有比特币，观察市场，不参与，不预测。`
  ]
  const paras = notionParas.length > 0 ? notionParas : fallbackParas

  return (
    <div className='about-page'>
      <AboutHero />
      <section className='about-story' aria-labelledby='about-story-title'>
        <div className='about-section-label'>
          <span className='about-section-index'>01</span>
          <h2 id='about-story-title'>Notes behind the work</h2>
        </div>
        <div className='about-body'>
          {paras.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </section>
      <EditorialSections page={agenticPages.about} startIndex={2} />
      <AboutFacts postCount={postCount} tagCount={tagOptions?.length} />
      <Elsewhere />
    </div>
  )
}

const LayoutInfoPage = props => {
  const page = agenticPages[props.agenticPageKey]
  if (!page) return null

  return (
    <main className='info-page'>
      <header className='info-hero'>
        <div className='eyebrow'>{page.eyebrow}</div>
        <h1>{page.title}</h1>
        <p>{page.description}</p>
      </header>
      <EditorialSections page={page} />
      <ResourceLinks links={page.links} />
    </main>
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
    <nav className='not-found-links' aria-label='页面未找到后的可用入口'>
      <SmartLink href='/' className='btn-ghost'>← 回首页</SmartLink>
      <SmartLink href='/sitemap.xml' className='btn-ghost'>站点地图</SmartLink>
      <SmartLink href='/llms.txt' className='btn-ghost'>Agent 导航</SmartLink>
      <SmartLink href='/developer' className='btn-ghost'>开发者资源</SmartLink>
    </nav>
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
  LayoutInfoPage,
  Layout404
}
