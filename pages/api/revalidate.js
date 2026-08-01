/**
 * 按需重新验证（On-Demand ISR）
 *
 * NEXT_REVALIDATE_SECOND 调到 3600 之后，文章更新最多要等 1 小时才会生效。
 * 这个接口让你在改完 Notion 后主动刷新指定页面，立刻看到新内容，
 * 同时不用把全站的自动再生间隔调低（那才是烧 ISR 写入额度的元凶）。
 *
 * 用法（GET 或 POST 都可以）：
 *   /api/revalidate?secret=xxx&path=/            刷新首页
 *   /api/revalidate?secret=xxx&path=/my-post     刷新单篇文章
 *   /api/revalidate?secret=xxx&path=/&path=/about  一次刷多个
 *
 * 需要配置环境变量 REVALIDATE_SECRET；未配置时接口直接关闭，
 * 避免变成一个任何人都能触发回源 Notion 的公开端点。
 */
import crypto from 'crypto'

// 一次最多刷新多少个路径，防止一个请求打爆 Notion 配额
const MAX_PATHS = 20

/** 常数时间比较，避免用响应时间猜 secret */
function safeEqual(a, b) {
  const bufA = Buffer.from(String(a))
  const bufB = Buffer.from(String(b))
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}

/** 只接受站内绝对路径，挡掉 //evil.com 这类协议相对地址 */
function isValidPath(p) {
  return (
    typeof p === 'string' &&
    p.startsWith('/') &&
    !p.startsWith('//') &&
    !p.includes('..') &&
    p.length <= 200 &&
    // eslint-disable-next-line no-control-regex
    !/[\x00-\x1f\x7f\\]/.test(p)
  )
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0')

  const secret = process.env.REVALIDATE_SECRET
  if (!secret) {
    return res
      .status(503)
      .json({ ok: false, error: '未配置 REVALIDATE_SECRET，接口已关闭' })
  }

  const provided = req.query?.secret ?? req.body?.secret
  if (!provided || !safeEqual(provided, secret)) {
    return res.status(401).json({ ok: false, error: 'secret 不正确' })
  }

  // path 可以传一个或多个
  const raw = req.query?.path ?? req.body?.path ?? '/'
  const paths = (Array.isArray(raw) ? raw : [raw]).slice(0, MAX_PATHS)

  const invalid = paths.filter(p => !isValidPath(p))
  if (invalid.length) {
    return res.status(400).json({ ok: false, error: '路径不合法', invalid })
  }

  const revalidated = []
  const failed = []
  for (const p of paths) {
    try {
      await res.revalidate(p)
      revalidated.push(p)
    } catch (e) {
      // 单个路径失败不影响其它路径
      failed.push({ path: p, reason: e?.message || String(e) })
    }
  }

  return res.status(failed.length ? 207 : 200).json({
    ok: failed.length === 0,
    revalidated,
    failed
  })
}
