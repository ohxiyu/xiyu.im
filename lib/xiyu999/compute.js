/**
 * xiyu999 指数计算（纯函数，无 IO）。
 *
 * xiyu999 = (P / GMA200)^(0.6/σ1y) × (P / RP)^(0.6/σ2y)
 *   GMA200：200 日几何均价
 *   RP：链上平均成本（Realized Price），= P / MVRV
 *   σ1y / σ2y：365 / 730 天日对数收益率的年化标准差（样本标准差，ddof=1）
 *
 * 口径与博客文章里的 pandas 实现一致：rolling 窗口包含当天。
 */

export const REF_VOL = 0.6
export const ZONES = [
  { key: 'buy', label: '抄底区', max: 0.65 },
  { key: 'dca', label: '定投区', max: 2 },
  { key: 'hold', label: '持有区', max: 5 },
  { key: 'hot', label: '过热区', max: Infinity }
]
export const LEVELS = [5, 2, 1, 0.65, 0.49, 0.38]

const GENESIS_MS = Date.UTC(2009, 0, 3)
const DAY_MS = 86400000
const OZ_PER_TONNE = 32150.7

export const zoneOf = x => ZONES.find(z => x < z.max) || ZONES[ZONES.length - 1]

/** 黄金地上存量估算（吨）：WGC 2024 年底约 21.6 万吨，每年约 +3,300 吨 */
export const goldTonnes = dateMs => {
  const year = new Date(dateMs).getUTCFullYear()
  const start = Date.UTC(year, 0, 1)
  const frac = year + (dateMs - start) / (365.25 * DAY_MS)
  return 216265 + (frac - 2025) * 3300
}

const rollingMean = (arr, w) => {
  const out = new Array(arr.length).fill(NaN)
  let sum = 0
  let n = 0
  for (let i = 0; i < arr.length; i++) {
    const v = arr[i]
    if (Number.isFinite(v)) {
      sum += v
      n++
    }
    if (i >= w) {
      const old = arr[i - w]
      if (Number.isFinite(old)) {
        sum -= old
        n--
      }
    }
    if (i >= w - 1 && n === w) out[i] = sum / w
  }
  return out
}

const rollingStd = (arr, w) => {
  const out = new Array(arr.length).fill(NaN)
  for (let i = w - 1; i < arr.length; i++) {
    let sum = 0
    let ok = true
    for (let k = i - w + 1; k <= i; k++) {
      if (!Number.isFinite(arr[k])) {
        ok = false
        break
      }
      sum += arr[k]
    }
    if (!ok) continue
    const mean = sum / w
    let ss = 0
    for (let k = i - w + 1; k <= i; k++) ss += (arr[k] - mean) ** 2
    out[i] = Math.sqrt(ss / (w - 1))
  }
  return out
}

/** 给定当日的均价、链上成本、波动率，反推 xiyu999 等于 x 时的价格 */
export const priceForIndex = (x, { g, rp, s1, s2 }) => {
  const k = 1 / s1 + 1 / s2
  return Math.exp((Math.log(x) / REF_VOL + Math.log(g) / s1 + Math.log(rp) / s2) / k)
}

/**
 * @param {Array<{date:string,price:number,mvrv:number,supply:number}>} rows 按日期升序的日线
 * @param {{date:string,price:number}|null} gold 最近一日金价（PAXG ≈ 1 盎司黄金）
 * @param {{seriesFrom?:string}} [opts]
 */
export function computeXiyu999 (rows, gold = null, opts = {}) {
  const seriesFrom = opts.seriesFrom || '2012-01-01'
  const clean = rows.filter(r => r.price > 0 && r.mvrv > 0)
  const n = clean.length
  const t = clean.map(r => Date.parse(r.date + 'T00:00:00Z'))
  const p = clean.map(r => r.price)
  const lp = p.map(Math.log)
  const ret = lp.map((v, i) => (i ? v - lp[i - 1] : NaN))
  const gmaLog = rollingMean(lp, 200)
  const sd1 = rollingStd(ret, 365)
  const sd2 = rollingStd(ret, 730)
  const ann = Math.sqrt(365)

  const daily = new Array(n)
  for (let i = 0; i < n; i++) {
    const g = Math.exp(gmaLog[i])
    const s1 = sd1[i] * ann
    const s2 = sd2[i] * ann
    const mvrv = clean[i].mvrv
    const x = Math.exp(REF_VOL * (Math.log(p[i] / g) / s1 + Math.log(mvrv) / s2))
    const age = (t[i] - GENESIS_MS) / DAY_MS
    const est = 10 ** (5.84 * Math.log10(age) - 17.01)
    daily[i] = {
      date: clean[i].date,
      t: t[i],
      p: p[i],
      g,
      rp: p[i] / mvrv,
      mvrv,
      s1,
      s2,
      x,
      ahr: (p[i] / g) * (p[i] / est),
      supply: clean[i].supply
    }
  }

  const valid = daily.filter(d => Number.isFinite(d.x) && d.date >= seriesFrom)
  if (!valid.length) throw new Error('xiyu999: not enough history')

  // 周线：每周（周日结束）取最后一天，标签用周日；最后一个点用最新那一天
  const weeks = new Map()
  for (const d of valid) {
    const dow = new Date(d.t).getUTCDay()
    const sunday = new Date(d.t + ((7 - dow) % 7) * DAY_MS).toISOString().slice(0, 10)
    weeks.set(sunday, d)
  }
  const round = (v, digits) => Number(v.toFixed(digits))
  const series = [...weeks.entries()].map(([label, d]) => [
    label,
    round(d.x, 3),
    round(d.ahr, 3),
    d.p < 10 ? round(d.p, 2) : Math.round(d.p),
    d.rp < 10 ? round(d.rp, 2) : Math.round(d.rp)
  ])
  const last = valid[valid.length - 1]
  series[series.length - 1][0] = last.date

  const below = valid.filter(d => d.x < last.x).length
  const levels = LEVELS.map(x => ({ x, price: Math.round(priceForIndex(x, last)) }))

  let goldOut = null
  if (gold && gold.price > 0 && last.supply > 0) {
    const goldCap = gold.price * goldTonnes(last.t) * OZ_PER_TONNE
    const btcCap = last.p * last.supply
    goldOut = {
      date: gold.date,
      price: round(gold.price, 2),
      share: btcCap / goldCap,
      btcCap,
      goldCap
    }
  }

  return {
    series,
    now: {
      date: last.date,
      x: round(last.x, 4),
      zone: zoneOf(last.x).label,
      p: Math.round(last.p),
      g: Math.round(last.g),
      rp: Math.round(last.rp),
      mvrv: round(last.mvrv, 4),
      s1: round(last.s1, 4),
      s2: round(last.s2, 4),
      ahr: round(last.ahr, 3),
      pctile: round(below / valid.length, 4),
      levels,
      gold: goldOut
    }
  }
}
