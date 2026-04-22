import { useEffect, useRef } from 'react'
import { loadExternalResource } from '@/lib/utils'

/**
 * 滚动阻尼特效
 * 目前只用在proxio主题
 * @returns
 */
const Lenis = () => {
  const lenisRef = useRef(null) // 用于存储 Lenis 实例
  const rafIdRef = useRef(0)

  useEffect(() => {
    let cancelled = false
    // 异步加载
    async function loadLenis() {
      try {
        await loadExternalResource('/js/lenis.js', 'js')

        if (cancelled) return
        if (!window.Lenis) {
          console.error('Lenis not loaded')
          return
        }
        const Lenis = window.Lenis

        // 创建 Lenis 实例
        const lenis = new Lenis({
          duration: 1.2,
          easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
          direction: 'vertical', // vertical, horizontal
          gestureDirection: 'vertical', // vertical, horizontal, both
          smooth: true,
          mouseMultiplier: 1,
          smoothTouch: false,
          touchMultiplier: 2,
          infinite: false
        })

        lenisRef.current = lenis

        // 动画帧循环，保存 id 便于卸载时取消
        const raf = time => {
          if (cancelled) return
          lenis.raf(time)
          rafIdRef.current = requestAnimationFrame(raf)
        }

        rafIdRef.current = requestAnimationFrame(raf)
      } catch (error) {
        console.error('Failed to load Lenis:', error)
      }
    }

    loadLenis()

    return () => {
      cancelled = true
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = 0
      }
      if (lenisRef.current) {
        lenisRef.current.destroy()
        lenisRef.current = null
      }
    }
  }, [])

  return <></>
}

export default Lenis
