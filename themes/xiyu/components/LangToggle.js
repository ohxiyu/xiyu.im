import { useEffect, useState } from 'react'
import { loadExternalResource } from '@/lib/utils'

const LANG_KEY = 'xiyu_lang'
// 主备双 CDN：官方源 + jsDelivr 的 npm 镜像
const SDK_URLS = [
  'https://res.zvo.cn/translate/translate.js',
  'https://cdn.jsdelivr.net/npm/i18n-jsautotranslate@3/translate.js'
]

// 等 window.translate 就绪（loadExternalResource 在标签已存在时会提前 resolve）
const waitForSDK = async (ms = 6000) => {
  const start = Date.now()
  while (!window.translate) {
    if (Date.now() - start > ms) return null
    await new Promise(r => setTimeout(r, 100))
  }
  return window.translate
}

const loadSDK = async () => {
  if (window.translate) return window.translate
  for (const url of SDK_URLS) {
    try {
      await loadExternalResource(url, 'js')
      const t = await waitForSDK()
      if (t) return t
    } catch (e) {
      console.warn('[LangToggle] CDN failed:', url, e)
    }
  }
  return null
}

// 顶部"翻译中"横幅：管理预期，避免用户以为点了没反应
const BANNER_ID = 'xiyu-translating-banner'
const showBanner = () => {
  if (document.getElementById(BANNER_ID)) return
  const el = document.createElement('div')
  el.id = BANNER_ID
  el.textContent = 'Translating… 翻译中，内容将逐步替换为英文'
  el.style.cssText = [
    'position:fixed', 'top:0', 'left:0', 'right:0', 'z-index:9999',
    'padding:8px 16px', 'text-align:center',
    'font-size:12px', 'letter-spacing:0.05em',
    'background:var(--accent, #e67e22)', 'color:#fff',
    'opacity:0.95', 'transition:opacity .4s'
  ].join(';')
  document.body.appendChild(el)
}
const hideBanner = (delay = 0) => {
  setTimeout(() => {
    const el = document.getElementById(BANNER_ID)
    if (!el) return
    el.style.opacity = '0'
    setTimeout(() => el.remove(), 450)
  }, delay)
}

// 智能收横幅：监听 DOM 文本变化（翻译逐块替换），静默 2.5s 视为翻译完成
// 兜底 25s 强制收起（极端慢网）
const watchTranslationDone = () => {
  let idleTimer = null
  const done = () => {
    observer.disconnect()
    clearTimeout(hardStop)
    hideBanner()
  }
  const bump = () => {
    clearTimeout(idleTimer)
    idleTimer = setTimeout(done, 2500)
  }
  const observer = new MutationObserver(bump)
  observer.observe(document.body, { childList: true, subtree: true, characterData: true })
  const hardStop = setTimeout(done, 25000)
  bump() // 万一根本没有任何变化（全缓存瞬间完成），2.5s 后也会收
}

// 翻到英文（幂等，绝不触发页面刷新）
// ⚠️ 千万不要用 t.changeLanguage()：它的实现会 location.reload()，
//    配合"页面加载时自动恢复英文"的逻辑就是无限刷新循环（已踩坑）。
const runTranslate = async ({ silent = false } = {}) => {
  const t = await loadSDK()
  if (!t) throw new Error('translate.js unavailable')
  if (!silent) showBanner()
  t.language.setLocal('chinese_simplified')
  // client.edge：微软翻译接口，小批量并发请求，实测比官方公益通道
  // （单请求限量、多批串行、长文要等 10s+）快。
  // 注：此前 edge '点了没反应'是 changeLanguage/SDK 就绪 bug，与通道无关，均已修复。
  t.service.use('client.edge')
  t.selectLanguageTag.show = false // 禁用它自带的语言下拉
  // 代码块和等宽内容不翻译
  for (const cls of ['notion-code', 'post-num', 'post-date', 'brand-tag', 'hero-meta-num']) {
    if (!t.ignore.class.includes(cls)) t.ignore.class.push(cls)
  }
  t.listener.start() // 客户端路由跳转后的新内容也自动翻
  // 直接写目标语言（translate.js 官方存储 key 是 'to'）+ 实例变量双保险，
  // 然后 execute() 就地翻译——不触发 reload
  try { localStorage.setItem('to', 'english') } catch (e) {}
  t.to = 'english'
  t.execute()
  // 智能收横幅：DOM 静默 2.5s（翻译完成）自动消失，25s 兜底
  if (!silent) watchTranslationDone()
}

// 刷新循环熔断：5 秒内第 3 次加载视为异常循环，自动回退中文并停止一切翻译
const isReloadLoop = () => {
  try {
    const now = Date.now()
    const hist = JSON.parse(sessionStorage.getItem('xiyu_lang_loads') || '[]')
      .filter(ts => now - ts < 5000)
    hist.push(now)
    sessionStorage.setItem('xiyu_lang_loads', JSON.stringify(hist))
    return hist.length >= 3
  } catch (e) {
    return false
  }
}

/**
 * 中/英一键切换按钮（ThemeToggle 右边）
 * - 点 EN：动态加载 translate.js 就地翻译整页（无刷新）
 * - 点 中：清状态刷新回原文
 * - localStorage 持久化，翻页/回访保持
 */
const LangToggle = () => {
  const [isEn, setIsEn] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // 熔断：检测到刷新循环 → 强制回中文，清掉所有翻译状态
    if (isReloadLoop()) {
      console.warn('[LangToggle] reload loop detected, resetting to Chinese')
      try {
        localStorage.setItem(LANG_KEY, 'zh')
        localStorage.removeItem('to')
      } catch (e) {}
      return
    }

    // 回访恢复：上次选了 EN 就自动翻（静默、就地翻译，不刷新）
    if (localStorage.getItem(LANG_KEY) === 'en') {
      setIsEn(true)
      runTranslate({ silent: true }).catch(e => console.warn('[LangToggle]', e))
      return
    }

    // 空闲时预取 SDK 到浏览器 HTTP 缓存（只下载不执行），点 EN 时零下载延迟
    const prefetch = () => {
      try {
        const link = document.createElement('link')
        link.rel = 'prefetch'
        link.as = 'script'
        link.href = SDK_URLS[0]
        document.head.appendChild(link)
      } catch (e) { /* 预取失败无所谓，点击时正常加载 */ }
    }
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(prefetch, { timeout: 5000 })
      return () => window.cancelIdleCallback(id)
    }
    const t = setTimeout(prefetch, 3000)
    return () => clearTimeout(t)
  }, [])

  const toggle = async () => {
    if (busy) return
    if (isEn) {
      try {
        localStorage.setItem(LANG_KEY, 'zh')
        // 清掉 translate.js 的目标语言，避免刷新后它自己又翻回英文
        localStorage.removeItem('to')
      } catch (e) {}
      window.location.reload()
    } else {
      setBusy(true)
      try {
        await runTranslate()
        localStorage.setItem(LANG_KEY, 'en')
        setIsEn(true)
      } catch (e) {
        console.warn('[LangToggle] translate failed:', e)
        hideBanner()
        alert('翻译服务加载失败，请稍后重试 / Translation service failed, please retry.')
      } finally {
        setBusy(false)
      }
    }
  }

  return (
    <button
      className='theme-toggle lang-toggle'
      onClick={toggle}
      disabled={busy}
      title={isEn ? '切回中文' : 'Translate to English'}
      aria-label={isEn ? '切回中文' : 'Translate to English'}>
      <span className='lang-toggle-text'>{busy ? '…' : isEn ? '中' : 'EN'}</span>
    </button>
  )
}

export default LangToggle
