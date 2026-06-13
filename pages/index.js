import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData, getPostBlocks } from '@/lib/db/SiteDataApi'
import { fetchNotionPageBlocks } from '@/lib/db/notion/getPostBlocks'
import { generateRobotsTxt } from '@/lib/utils/robots.txt'
import { generateRss } from '@/lib/utils/rss'
import { generateSitemapXml } from '@/lib/utils/sitemap.xml'
import { DynamicLayout } from '@/themes/theme'
import { generateRedirectJson } from '@/lib/utils/redirect'
import { checkDataFromAlgolia } from '@/lib/plugins/algolia'

/**
 * 读 Notion 里 slug='hero' 的 page，解析每个段落为一行 hero 大字
 * 每段的 **加粗** 文本会变成橙色 <em>
 * 返回 [{ spans: [{text, bold}, ...] }, ...]
 */
async function loadHeroLines(heroPageId) {
  if (!heroPageId) return []
  try {
    const blockMap = await fetchNotionPageBlocks(heroPageId, 'hero-page')
    const blocks = blockMap?.block || {}
    const root = blocks[heroPageId]?.value
    const contentIds = root?.content || []
    const lines = []
    for (const id of contentIds) {
      const b = blocks[id]?.value
      if (!b) continue
      if (!['text', 'header', 'sub_header', 'sub_sub_header'].includes(b.type)) continue
      const title = b.properties?.title
      if (!Array.isArray(title)) continue
      const spans = title
        .map(span => {
          const text = String(span?.[0] ?? '')
          const fmt = Array.isArray(span?.[1]) ? span[1] : []
          const bold = fmt.some(f => Array.isArray(f) && f[0] === 'b')
          return { text, bold }
        })
        .filter(s => s.text.length > 0)
      if (spans.length > 0 && spans.some(s => s.text.trim())) {
        lines.push({ spans })
      }
    }
    return lines
  } catch (e) {
    console.warn('[hero page] load failed:', e?.message || e)
    return []
  }
}

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

  // 大字 slogan 池：读 Notion slug='hero' 的 page 内容，每段一句
  // 同时计算今天的 day-of-year idx（确定性、SSR 与客户端一致）
  const heroPage = props.allPages?.find(p => p?.slug === 'hero')
  const heroLines = await loadHeroLines(heroPage?.id)
  let heroIdx = 0
  if (heroLines.length > 0) {
    const d = new Date()
    const start = Date.UTC(d.getUTCFullYear(), 0, 0)
    const day = Math.floor((d.getTime() - start) / 86400000)
    heroIdx = day % heroLines.length
  }
  props.heroLines = heroLines
  props.heroIdx = heroIdx

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

  // 生成robotTxt
  await runSafeTask('generateRobotsTxt', () => generateRobotsTxt(props))
  // 生成Feed订阅
  await runSafeTask('generateRss', () => generateRss(props))
  // 生成站点地图
  await runSafeTask('generateSitemapXml', () => generateSitemapXml(props))
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

  return {
    props,
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        )
  }
}

export default Index
