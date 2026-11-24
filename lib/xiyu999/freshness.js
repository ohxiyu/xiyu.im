/**
 * xiyu999 的数据新鲜度和缓存时长。
 *
 * Coin Metrics 按 UTC 日收盘出日线：D 日的数值要到 D+1 日 UTC 0 点之后（北京时间 8 点后）
 * 才会陆续发布，具体几点不固定。所以：
 *   - 已经拿到"昨天（UTC）"的数据 → 缓存到下一个 UTC 0:30，之后再去看有没有新的一天
 *   - 还没拿到 → 只缓存 10 分钟，反复去取，直到新数据发布
 */
const DAY_MS = 86400000
export const RETRY_MS = 10 * 60 * 1000
const AFTER_MIDNIGHT_MS = 30 * 60 * 1000

/** 现在这个时刻，理应已经有的最新一天（UTC 昨天），YYYY-MM-DD */
export const expectedLatest = (nowMs = Date.now()) =>
  new Date(Math.floor(nowMs / DAY_MS) * DAY_MS - DAY_MS).toISOString().slice(0, 10)

/**
 * @param {string} latestDate 数据里最新一天
 * @param {number} nowMs
 * @returns {{ fresh: boolean, ttlMs: number }} ttlMs：这份数据还能用多久
 */
export function cachePolicy (latestDate, nowMs = Date.now()) {
  const fresh = Boolean(latestDate) && latestDate >= expectedLatest(nowMs)
  if (!fresh) return { fresh, ttlMs: RETRY_MS }
  const nextCheck = (Math.floor(nowMs / DAY_MS) + 1) * DAY_MS + AFTER_MIDNIGHT_MS
  return { fresh, ttlMs: Math.max(RETRY_MS, nextCheck - nowMs) }
}
