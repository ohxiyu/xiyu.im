// xiyu 主题格式化工具（统一 formatNum / formatDate*，消除各组件重复实现）

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// 文章编号 #0155：优先 pageProperties.num，缺省用 totalCount - idx 推算
export function formatNum(post, totalCount, idx) {
  const raw = post?.pageProperties?.num ?? post?.pageProperties?.Num
  if (raw !== undefined && raw !== null && raw !== '') return String(raw).padStart(4, '0')
  if (typeof totalCount === 'number' && typeof idx === 'number') {
    return String(totalCount - idx).padStart(4, '0')
  }
  return ''
}

// 用 UTC 解析，避免 SSR / 客户端时区不一致造成 hydration mismatch
function parseUTC(iso) {
  if (!iso || typeof iso !== 'string') return null
  const d = new Date(iso + 'T00:00:00Z')
  return isNaN(d.getTime()) ? null : d
}

// 'Apr 23, 2026'
export function formatDateEN(iso) {
  const d = parseUTC(iso)
  if (!d) return iso || ''
  return `${MONTHS_EN[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`
}

// '2026 · 04 · 23'
export function formatDateCN(iso) {
  const d = parseUTC(iso)
  if (!d) return iso || ''
  return `${d.getUTCFullYear()} · ${String(d.getUTCMonth() + 1).padStart(2, '0')} · ${String(d.getUTCDate()).padStart(2, '0')}`
}
