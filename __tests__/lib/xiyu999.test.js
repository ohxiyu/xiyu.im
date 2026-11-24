import {
  computeXiyu999,
  priceForIndex,
  zoneOf,
  REF_VOL
} from '@/lib/xiyu999/compute'

// 确定性的伪随机游走，避免测试结果随机
const makeRows = (days, seed = 7) => {
  let s = seed
  const rand = () => {
    s = (s * 1103515245 + 12345) % 2147483648
    return s / 2147483648
  }
  const rows = []
  let price = 10000
  let rp = 8000
  const start = Date.UTC(2015, 0, 1)
  for (let i = 0; i < days; i++) {
    price *= Math.exp((rand() - 0.495) * 0.06)
    rp += (price - rp) * 0.01
    rows.push({
      date: new Date(start + i * 86400000).toISOString().slice(0, 10),
      price,
      mvrv: price / rp,
      supply: 19e6
    })
  }
  return rows
}

describe('xiyu999 计算', () => {
  const rows = makeRows(1600)
  const out = computeXiyu999(rows, { date: rows[rows.length - 1].date, price: 4000 }, { seriesFrom: '2015-01-01' })

  it('最新读数有限，区间与读数一致', () => {
    expect(Number.isFinite(out.now.x)).toBe(true)
    expect(out.now.zone).toBe(zoneOf(out.now.x).label)
  })

  it('读数等于按公式手算的结果', () => {
    const { p, g, rp, s1, s2, x } = out.now
    const manual = Math.pow(p / g, REF_VOL / s1) * Math.pow(p / rp, REF_VOL / s2)
    // now 里的 p/g/rp 已取整，允许极小误差
    expect(manual).toBeCloseTo(x, 2)
  })

  it('关键价位反推回去，得到对应的指数值', () => {
    const params = { g: 100, rp: 80, s1: 0.5, s2: 0.45 }
    for (const x of [0.38, 0.65, 1, 2, 5]) {
      const price = priceForIndex(x, params)
      const back =
        Math.pow(price / params.g, REF_VOL / params.s1) *
        Math.pow(price / params.rp, REF_VOL / params.s2)
      expect(back).toBeCloseTo(x, 10)
    }
  })

  it('价格同时等于 200 日成本和链上成本时，读数为 1', () => {
    expect(priceForIndex(1, { g: 100, rp: 100, s1: 0.5, s2: 0.5 })).toBeCloseTo(100, 10)
  })

  it('序列是逐日的，最后一个点是最新一天', () => {
    const last = out.series[out.series.length - 1]
    expect(last[0]).toBe(rows[rows.length - 1].date)
    const d0 = Date.parse(out.series[0][0])
    const d1 = Date.parse(out.series[1][0])
    expect(d1 - d0).toBe(86400000)
    expect(last).toHaveLength(5)
  })

  it('有金价时给出比特币/黄金市值比', () => {
    expect(out.now.gold.share).toBeGreaterThan(0)
    expect(out.now.gold.share).toBeLessThan(1)
  })

  it('历史不足两年时抛错，而不是返回 NaN', () => {
    expect(() => computeXiyu999(makeRows(500), null)).toThrow('not enough history')
  })
})

describe('区间划分', () => {
  it('按 0.65 / 2 / 5 分界', () => {
    expect(zoneOf(0.64).label).toBe('抄底区')
    expect(zoneOf(0.65).label).toBe('定投区')
    expect(zoneOf(1.99).label).toBe('定投区')
    expect(zoneOf(2).label).toBe('持有区')
    expect(zoneOf(5).label).toBe('过热区')
  })
})

describe('xiyu999 数据新鲜度', () => {
  const { cachePolicy, expectedLatest, RETRY_MS } = require('@/lib/xiyu999/freshness')
  const t = iso => Date.parse(iso)

  it('UTC 11-24 任意时刻，应有的最新一天是 11-23', () => {
    expect(expectedLatest(t('2026-11-24T00:05:00Z'))).toBe('2026-11-23')
    expect(expectedLatest(t('2026-11-24T23:59:00Z'))).toBe('2026-11-23')
  })

  it('还没拿到昨天的数据：10 分钟后重取', () => {
    const p = cachePolicy('2026-11-22', t('2026-11-24T02:33:00Z'))
    expect(p.fresh).toBe(false)
    expect(p.ttlMs).toBe(RETRY_MS)
  })

  it('拿到昨天的数据：缓存到下一个 UTC 0:30', () => {
    const p = cachePolicy('2026-11-23', t('2026-11-24T03:00:00Z'))
    expect(p.fresh).toBe(true)
    expect(p.ttlMs).toBe(t('2026-11-25T00:30:00Z') - t('2026-11-24T03:00:00Z'))
  })

  it('跨过 UTC 0 点后，旧数据立即变成不新鲜', () => {
    expect(cachePolicy('2026-11-23', t('2026-11-25T00:31:00Z')).fresh).toBe(false)
  })
})
