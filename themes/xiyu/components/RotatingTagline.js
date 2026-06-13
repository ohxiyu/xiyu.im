import { useEffect, useMemo, useState } from 'react'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * 首页 Hero 大标题下方的轮换语录
 * - SSR 初值用 day-of-year 哈希挑，server/client 一致，无 hydration mismatch
 * - 客户端 mounted 后每 6s 淡入淡出切换
 * - 点击立刻翻下一句
 * - 池在 config.js 的 XIYU_HERO_TAGLINES
 */
const dayOfYear = () => {
  const now = new Date()
  const start = Date.UTC(now.getUTCFullYear(), 0, 0)
  return Math.floor((now.getTime() - start) / 86400000)
}

const RotatingTagline = ({ fallback }) => {
  const list = useMemo(() => {
    const arr = siteConfig('XIYU_HERO_TAGLINES', [], CONFIG)
    return Array.isArray(arr) && arr.length > 0 ? arr : (fallback ? [fallback] : [])
  }, [fallback])

  // 初始下标：day-of-year 取模，保证 SSR / 客户端一致
  const initialIdx = useMemo(() => (list.length ? dayOfYear() % list.length : 0), [list.length])
  const [idx, setIdx] = useState(initialIdx)
  const [fade, setFade] = useState(false)

  useEffect(() => {
    if (list.length < 2) return
    const t = setInterval(() => {
      setFade(true)
      setTimeout(() => {
        setIdx(i => (i + 1) % list.length)
        setFade(false)
      }, 280)
    }, 6000)
    return () => clearInterval(t)
  }, [list.length])

  const onClick = () => {
    if (list.length < 2) return
    setFade(true)
    setTimeout(() => {
      setIdx(i => (i + 1) % list.length)
      setFade(false)
    }, 200)
  }

  if (!list.length) return null
  const text = list[idx]

  return (
    <p
      className='hero-subtitle hero-tagline'
      onClick={onClick}
      title='点一下换下一句'
      style={{
        cursor: list.length > 1 ? 'pointer' : 'default',
        userSelect: 'none',
        opacity: fade ? 0 : 1,
        transition: 'opacity .25s ease-out'
      }}>
      {text}
      {list.length > 1 && (
        <span className='hero-tagline-dot' aria-hidden='true' />
      )}
    </p>
  )
}

export default RotatingTagline
