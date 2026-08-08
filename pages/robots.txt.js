import BLOG from '@/blog.config'

/**
 * 动态 robots.txt 兜底
 * lib/utils/robots.txt.js 的 generateRobotsTxt 在 Vercel 运行时因文件系统只读而静默失败，
 * 导致线上 /robots.txt 404。此路由保证任何环境都能返回内容。
 * 注：public/robots.txt 若存在（本地构建产物）会优先于本路由，两者内容一致。
 */
export const getServerSideProps = async ({ res }) => {
  const LINK = BLOG.LINK || 'https://www.xiyu.im'
  const content = [
    'User-agent: *',
    'Allow: /',
    // 搜索结果页的关键词空间是无界的，爬虫每抓一个新关键词就会触发一次
    // ISR 现场生成+写入。这类页面本身也没有收录价值，直接禁止抓取。
    'Disallow: /search/',
    'Disallow: /search$',
    '',
    `Host: ${LINK}`,
    `Sitemap: ${LINK}/sitemap.xml`
  ].join('\n')
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=59')
  res.write(content)
  res.end()
  return { props: {} }
}

const RobotsTxt = () => null
export default RobotsTxt
