import fs from 'fs'

/**
 * 构建期生成 public/robots.txt
 * 内容必须与 pages/robots.txt.js 保持一致：public 下的静态文件会优先于该动态路由。
 * 注意不要给每行加缩进——robots.txt 的指令必须顶格，原先的模板字符串写法会把
 * 缩进一起写进文件里。
 */
export function generateRobotsTxt(props) {
  const { siteInfo } = props
  const LINK = siteInfo?.link
  const content = [
    'User-agent: *',
    'Allow: /',
    // 搜索结果页的关键词空间是无界的，爬虫每抓一个新关键词就会触发一次
    // ISR 现场生成+写入。这类页面本身也没有收录价值，直接禁止抓取。
    'Disallow: /search/',
    'Disallow: /search$',
    '',
    `Host: ${LINK}`,
    `Sitemap: ${LINK}/sitemap.xml`,
    ''
  ].join('\n')

  try {
    fs.mkdirSync('./public', { recursive: true })
    fs.writeFileSync('./public/robots.txt', content)
  } catch (error) {
    // 在vercel运行环境是只读的，这里会报错；
    // 但在vercel编译阶段、或VPS等其他平台这行代码会成功执行
  }
}
