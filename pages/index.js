import { isFullStatic } from '@/lib/utils/buildMode'
import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData, getPostBlocks } from '@/lib/db/SiteDataApi'
import { slimPostsForList } from '@/lib/utils/post'
import { generateRss } from '@/lib/utils/rss'
import { DynamicLayout } from '@/themes/theme'
import { generateRedirectJson } from '@/lib/utils/redirect'
import { checkDataFromAlgolia } from '@/lib/plugins/algolia'

/**
 * 首页布局
 * @param {*} props
 * @returns
 */
const Index = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutIndex' {...props} />
}

/**
 * SSG 获取数据
 * @returns
 */
export async function getStaticProps(req) {
  const { locale } = req
  const from = 'index'
  const props = await fetchGlobalAllData({ from, locale })
  const POST_PREVIEW_LINES = siteConfig(
    'POST_PREVIEW_LINES',
    12,
    props?.NOTION_CONFIG
  )
  props.posts = props.allPages
    ?.filter(page => page.type === 'Post' && page.status === 'Published')
    ?.sort((a, b) => {
      const dateA = new Date(a?.publishDate || 0).getTime()
      const dateB = new Date(b?.publishDate || 0).getTime()
      return dateB - dateA
    })

  // 处理分页
  if (siteConfig('POST_LIST_STYLE') === 'scroll') {
    // 滚动列表默认给前端返回所有数据
  } else if (siteConfig('POST_LIST_STYLE') === 'page') {
    props.posts = props.posts?.slice(
      0,
      siteConfig('POSTS_PER_PAGE', 12, props?.NOTION_CONFIG)
    )
  }

  // 首页大字 slogan：从最近 N 篇文章里按 day-of-year 选一篇的标题
  // 数据完全用 props.posts（已 sort 过），server 计算 idx 写进 props 避免 hydration mismatch
  const HERO_POOL_SIZE = 20
  const heroPool = (props.posts || []).slice(0, HERO_POOL_SIZE)
  let heroPickedIdx = 0
  if (heroPool.length > 0) {
    const d = new Date()
    const start = Date.UTC(d.getUTCFullYear(), 0, 0)
    const day = Math.floor((d.getTime() - start) / 86400000)
    heroPickedIdx = day % heroPool.length
  }
  props.heroPickedIdx = heroPickedIdx
  props.heroPoolSize = HERO_POOL_SIZE

  // 预览文章内容（并行抓取以加速构建）
  if (siteConfig('POST_LIST_PREVIEW', false, props?.NOTION_CONFIG)) {
    await Promise.all(
      (props.posts || []).map(async post => {
        if (post.password && post.password !== '') return
        try {
          post.blockMap = await getPostBlocks(post.id, 'slug', POST_PREVIEW_LINES)
        } catch (error) {
          console.warn(
            `[index:getStaticProps] getPostBlocks failed for post ${post?.id}:`,
            error
          )
        }
      })
    )
  }

  // 非关键副作用任务（失败不应阻塞首页渲染，避免ISR失败后首页长期停留旧内容）
  const runSafeTask = async (taskName, task) => {
    try {
      await Promise.resolve(task())
    } catch (error) {
      console.warn(`[index:getStaticProps] ${taskName} failed:`, error)
    }
  }

  // 生成Feed订阅
  await runSafeTask('generateRss', () => generateRss(props))
  // 检查数据是否需要从algolia删除
  await runSafeTask('checkDataFromAlgolia', () => checkDataFromAlgolia(props))
  if (siteConfig('UUID_REDIRECT', false, props?.NOTION_CONFIG)) {
    // 生成重定向 JSON
    await runSafeTask('generateRedirectJson', () =>
      generateRedirectJson(props)
    )
  }

  // 生成全文索引 - 仅在 yarn build 时执行 && process.env.npm_lifecycle_event === 'build'

  delete props.allPages
  // 列表数据瘦身：去掉 content[]/全量 pageProperties 等大字段，page data ~253kB -> ~40kB
  props.posts = slimPostsForList(props.posts)

  // 首页一篇文章都没有，基本只有两种可能：Notion 这次没拉到，或者配置出了问题。
  const isEmpty = !Array.isArray(props.posts) || props.posts.length === 0

  if (isEmpty && isFullStatic()) {
    // 全量静态下产物是永久的：一旦把空首页构建出来，它会一直空到下次构建。
    // 所以这里直接让构建失败——Vercel 会保留上一个成功的部署，
    // 站点继续正常服务旧内容，而不是上线一个空站点。
    throw new Error(
      '[index:getStaticProps] 首页文章列表为空，中止构建。' +
        '通常是 Notion 未返回数据（检查日志里的 NOTION_ACCESS_DENIED / ' +
        'ALLPAGES_EMPTY），或 NOTION_PAGE_ID 配置有误。' +
        '构建失败不影响线上：Vercel 会保留上一个成功的部署。'
    )
  }

  if (isEmpty) {
    console.warn(
      '[index:getStaticProps] 首页文章列表为空，改用 30s 短间隔重试，不做长时间静态化'
    )
  }

  return {
    props,
    revalidate: isFullStatic()
      ? undefined
      : isEmpty
        ? 30
        : siteConfig(
            'NEXT_REVALIDATE_SECOND',
            BLOG.NEXT_REVALIDATE_SECOND,
            props.NOTION_CONFIG
          )
  }
}

export default Index
