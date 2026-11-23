import { computeXiyu999 } from '@/lib/xiyu999/compute'

/**
 * GET /api/xiyu999
 *
 * 给 public/xiyu999.html 提供每日更新的数据。数据源是 Coin Metrics 社区版免费接口：
 *   btc：PriceUSD、CapMVRVCur（→ 链上平均成本）、SplyCur
 *   paxg：PriceUSD（1 PAXG ≈ 1 金衡盎司黄金，用来算比特币/黄金市值比）
 * Coin Metrics 每天出一根日线，所以 CDN 缓存 6 小时、过期后 1 天内先返回旧值再后台刷新。
 */

const CM = 'https://community-api.coinmetrics.io/v4/timeseries/asset-metrics'
const MEMORY_TTL_MS = 60 * 60 * 1000

let memo = { body: null, at: 0 }

async function fetchAll (params) {
  let url = `${CM}?${new URLSearchParams({ frequency: '1d', page_size: '10000', ...params }).toString()}`
  const out = []
  for (let page = 0; url && page < 5; page++) {
    const res = await fetch(url, { headers: { 'User-Agent': 'xiyu.im/xiyu999' } })
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
    if (!memo.body || Date.now() - memo.at > MEMORY_TTL_MS) {
      memo = { body: await build(), at: Date.now() }
    }
    res.setHeader('Cache-Control', 'public, s-maxage=21600, stale-while-revalidate=86400')
    // 首页卡片只要当天读数：?fields=now 省掉 700 多个周线点
    if (req.query?.fields === 'now') {
      return res.status(200).json({ now: memo.body.now, builtAt: memo.body.builtAt })
    }
    return res.status(200).json(memo.body)
  } catch (err) {
    console.error('[xiyu999] %s', err instanceof Error ? err.message : String(err))
    if (memo.body) {
      res.setHeader('Cache-Control', 'public, s-maxage=600')
      return res.status(200).json({ ...memo.body, stale: true })
    }
    res.setHeader('Cache-Control', 'no-store')
    return res.status(502).json({ error: 'upstream unavailable' })
  }
}
