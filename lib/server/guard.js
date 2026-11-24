import { createHash, timingSafeEqual } from 'node:crypto'

/**
 * API 防护的小工具：常量时间比较 token、取客户端 IP、按 IP 的内存限流。
 * 内存限流只在单个函数实例内有效，挡的是单个来源的连续刷；
 * 大流量攻击要靠 Vercel Firewall（见 AGENTS.md）。
 */

const digest = value => createHash('sha256').update(String(value)).digest()

/** 常量时间比较，expected 为空时一律返回 false（失败即关闭） */
export function tokenMatches (received, expected) {
  if (!expected || !received) return false
  return timingSafeEqual(digest(received), digest(expected))
}

/** 从 Authorization: Bearer xxx 里取 token */
export function bearerToken (req) {
  const header = String(req.headers?.authorization || '')
  return header.startsWith('Bearer ') ? header.slice(7).trim() : ''
}

/** Vercel 会覆盖这两个头，客户端伪造不了 */
export function clientIp (req) {
  const real = req.headers?.['x-real-ip']
  const fwd = req.headers?.['x-forwarded-for']
  const first = String(Array.isArray(fwd) ? fwd[0] : fwd || '').split(',')[0]
  return String(real || first || '').trim() || 'unknown'
}

/**
 * 固定窗口限流：windowMs 内同一 key 最多 max 次
 * @returns {(key: string) => boolean} 返回 true 表示超限
 */
export function createRateLimiter ({ windowMs, max, maxKeys = 5000 }) {
  const hits = new Map()
  return key => {
    const now = Date.now()
    const entry = hits.get(key)
    if (!entry || now - entry.start >= windowMs) {
      if (hits.size >= maxKeys) hits.clear()
      hits.set(key, { start: now, count: 1 })
      return false
    }
    entry.count += 1
    return entry.count > max
  }
}
