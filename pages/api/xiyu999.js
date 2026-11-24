import { computeXiyu999 } from '@/lib/xiyu999/compute'
import { cachePolicy } from '@/lib/xiyu999/freshness'

/**
 * GET /api/xiyu999
 *
 * 给 public/xiyu999.html 提供每日更新的数据。数据源是 Coin Metrics 社区版免费接口：
 *   btc：PriceUSD、CapMVRVCur（→ 链上平均成本）、SplyCur
 *   paxg：PriceUSD（1 PAXG ≈ 1 金衡盎司黄金，用来算比特币/黄金市值比）
 * Coin Metrics 按 UTC 日收盘出日线，发布时间不固定。缓存时长按"有没有拿到昨天的数据"来定，
 * 见 lib/xiyu999/freshness.js：拿到了就缓存到下一个 UTC 0:30，没拿到就每 10 分钟重取。
 */

const CM = 'https://community-api.coinmetrics.io/v4/timeseries/asset-metrics'
let memo = { body: null, until: 0 }
// 同一实例里同时进来的请求共用一次上游拉取，避免并发时把 Coin Metrics 打爆
let inflight = null
const UPSTREAM_TIMEOUT_MS = 8000

async function fetchAll (params) {
  let url = `${CM}?${new URLSearchParams({ frequency: '1d', page_size: '10000', ...params }).toString()}`
  const out = []
  for (let page = 0; url && page < 5; page++) {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'xiyu.im/xiyu999' },
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS)
    })
    if (!res.ok) throw new Error(`coinmetrics ${res.status}`)
    const json = await res.json()
    out.push(...(json.data || []))
    url = json.next_page_url || null
  }
  return out
}

async function build () {
  const since = new Date(Date.now() - 21 * 86400000).toISOString().slice(0, 10)
  const [btc, paxg] = await Promise.all([
    fetchAll({ assets: 'btc', metrics: 'PriceUSD,CapMVRVCur,SplyCur', start_time: '2010-07-01' }),
    fetchAll({ assets: 'paxg', metrics: 'PriceUSD', start_time: since })
  ])
  const rows = btc
    .filter(r => r.PriceUSD && r.CapMVRVCur)
    .map(r => ({
      date: r.time.slice(0, 10),
      price: Number(r.PriceUSD),
      mvrv: Number(r.CapMVRVCur),
      supply: Number(r.SplyCur)
    }))
  const lastGold = paxg.filter(r => r.PriceUSD).pop()
  const gold = lastGold
    ? { date: lastGold.time.slice(0, 10), price: Number(lastGold.PriceUSD) }
    : null
  return { ...computeXiyu999(rows, gold), source: 'coinmetrics-community', builtAt: new Date().toISOString() }
}

export default async function handler (req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD')
    return res.status(405).json({ error: 'method not allowed' })
  }
  try {
    if (!memo.body || Date.now() > memo.until) {
      if (!inflight) {
        inflight = build()
          .then(body => {
            memo = { body, until: Date.now() + cachePolicy(body.now.date).ttlMs }
          })
          .finally(() => {
            inflight = null
          })
      }
      await inflight
    }
    const ttl = Math.max(60, Math.floor((memo.until - Date.now()) / 1000))
    res.setHeader('Cache-Control', `public, s-maxage=${ttl}, stale-while-revalidate=600`)
    // 首页卡片只要当天读数：?fields=now 省掉 5000 多个逐日点
    if (req.query?.fields === 'now') {
      return res.status(200).json({ now: memo.body.now, builtAt: memo.body.builtAt })
    }
    return res.status(200).json(memo.body)
  } catch (err) {
    console.error('[xiyu999] %s', err instanceof Error ? err.message : String(err))
    if (memo.body) {
      memo.until = Date.now() + 5 * 60 * 1000
      res.setHeader('Cache-Control', 'public, s-maxage=300')
      return res.status(200).json({ ...memo.body, stale: true })
    }
    res.setHeader('Cache-Control', 'no-store')
    return res.status(502).json({ error: 'upstream unavailable' })
  }
}
