import { fetchGlobalAllData, getNavPages } from '@/lib/db/SiteDataApi'
import { toSearchIndex } from '@/lib/search/searchIndex'

/**
 * GET /api/search-index
 * 站点搜索面板（public/js/site-search.js）用的文章列表：标题、链接、日期、分类、标签、摘要。
 * 只含已发布文章；CDN 缓存 10 分钟，过期后 1 天内先给旧的再后台刷新。
 */
export default async function handler (req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  try {
    const props = await fetchGlobalAllData({ from: 'search-index' })
    const pages = props?.allNavPages?.length ? props.allNavPages : getNavPages({ allPages: props?.allPages || [] })
    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=86400')
    return res.status(200).json({ posts: toSearchIndex(pages) })
  } catch (error) {
    console.error('[search-index] %s', error?.message || error)
    res.setHeader('Cache-Control', 'public, s-maxage=60')
    return res.status(502).json({ posts: [] })
  }
}
