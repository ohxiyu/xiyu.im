/**
 * 站点搜索用的文章索引：标题、链接、日期、分类、标签、摘要（160 字以内），按发布时间倒序。
 * 字段名压短，整站上百篇也只有几十 KB。
 */
const pad = n => String(n).padStart(2, '0')
const day = ms => {
  const d = new Date(ms)
  return Number.isNaN(d.getTime()) ? '' : `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function toSearchIndex (pages = []) {
  return pages
    .filter(p => p && p.title && (p.href || p.slug))
    .sort((a, b) => (b.publishDate || 0) - (a.publishDate || 0))
    .map(p => ({
      t: p.title,
      h: p.href ? (p.href.startsWith('/') || p.href.startsWith('http') ? p.href : `/${p.href}`) : `/${p.slug}`,
      d: p.publishDate ? day(p.publishDate) : '',
      c: p.category || '',
      g: Array.isArray(p.tags) ? p.tags : [],
      s: String(p.summary || '').slice(0, 160)
    }))
}
