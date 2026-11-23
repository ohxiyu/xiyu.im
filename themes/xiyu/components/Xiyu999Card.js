import { useEffect, useState } from 'react'

/**
 * 首页 Hero 右侧的 xiyu999 指数模块，样式沿用 /xiyu999.html 的头部。
 *
 * 数据在客户端取 /api/xiyu999?fields=now（CDN 缓存，每天更新）。
 * 服务端渲染时没有数据，先出占位，避免把构建当天的读数固化进静态 HTML。
 */

const ZONES = [
  { key: 'buy', label: '抄底', lo: 0.3, hi: 0.65 },
  { key: 'dca', label: '定投', lo: 0.65, hi: 2 },
  { key: 'hold', label: '持有', lo: 2, hi: 5 },
  { key: 'hot', label: '过热', lo: 5, hi: 15 }
]
const TICKS = [0.65, 2, 5]
const L0 = Math.log(0.3)
const L1 = Math.log(15)
export const rulerPos = v =>
  ((Math.log(Math.min(Math.max(v, 0.3), 15)) - L0) / (L1 - L0)) * 100

const pct = r => `${Math.round(Math.abs(r - 1) * 100)}%`

export const describe = now => {
  const pg = now.p / now.g
  const prp = now.p / now.rp
  return `价格${pg < 1 ? '低于' : '高于'} 200 日成本 ${pct(pg)}，${prp >= 1 ? '仍高于' : '已跌破'}全网链上成本 ${pct(prp)}。`
}

export default function Xiyu999Card () {
  const [now, setNow] = useState(null)

  useEffect(() => {
    let alive = true
    fetch('/api/xiyu999?fields=now')
      .then(r => (r.ok ? r.json() : null))
      .then(j => {
        if (alive && j?.now && Number.isFinite(j.now.x)) setNow(j.now)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  const value = now ? now.x.toFixed(2) : '—'
  const f1 = now ? Math.pow(now.p / now.g, 0.6 / now.s1) : null
  const f2 = now ? Math.pow(now.p / now.rp, 0.6 / now.s2) : null

  return (
    // 独立静态页，不走 Next 路由
    <a
      href='/xiyu999.html'
      className='x9-card'
      aria-label={now ? `xiyu999 指数 ${value}，${now.zone}，查看完整指数` : 'xiyu999 指数，查看完整指数'}>
      <div className='x9-card-head'>
        <span className='x9-name'>xiyu999</span>
        <span className='x9-asof'>
          比特币链上成本指数{now ? <> · 截至 <span className='x9-mono'>{now.date}</span> 收盘</> : null}
        </span>
      </div>
      <div className='x9-body'>
        <div>
          <div className='x9-val'>{value}</div>
          <span className='x9-zone'>{now ? now.zone : '读取中'}</span>
        </div>
        <p className='x9-say'>
          {now ? `${describe(now)}历次大底都出现在价格跌破链上成本之后。` : '比特币相对近期成本和全网链上成本的位置，按波动率换算。'}
        </p>
      </div>
      <div className='x9-ruler' aria-hidden='true'>
        <div className='x9-bar'>
          {ZONES.map(z => (
            <div
              key={z.key}
              className={`x9-seg x9-seg-${z.key}`}
              style={{ width: `${rulerPos(z.hi) - rulerPos(z.lo)}%` }}>
              {z.label}
            </div>
          ))}
        </div>
        {now && <span className='x9-pin' style={{ left: `calc(${rulerPos(now.x)}% - 1.5px)` }} />}
        <div className='x9-ticks'>
          <span style={{ left: 0, transform: 'none' }}>0.3</span>
          {TICKS.map(t => (
            <span key={t} style={{ left: `${rulerPos(t)}%` }}>{t}</span>
          ))}
          <span style={{ left: 'auto', right: 0, transform: 'none' }}>15</span>
        </div>
      </div>
      <div className='x9-foot'>
        <span className='x9-mono'>
          {now ? `Mayer ${f1.toFixed(2)} × MVRV ${f2.toFixed(2)} = ${value}` : '每天自动更新'}
        </span>
        <span className='x9-more'>完整指数 →</span>
      </div>
    </a>
  )
}
