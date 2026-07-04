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
  el.textContent = 'Translating… 翻译中，长文章可能需要几秒'
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

// 翻到英文（幂等）
const runTranslate = async ({ silent = false } = {}) => {
  const t = await loadSDK()
  if (!t) throw new Error('translate.js unavailable')
  if (!silent) showBanner()
  t.language.setLocal('chinese_simplified')
  // 官方聚合服务器通道：批量整页翻译专用，比 client.edge（小批量串行请求微软接口）快数倍
  // 不显式 service.use 时默认就是官方通道；这里显式写出便于日后切换
  t.service.use('translate.service')
  t.selectLanguageTag.show = false // 禁用它自带的语言下拉
  // 代码块和等宽内容不翻译
  for (const cls of ['notion-code', 'post-num', 'post-date', 'brand-tag', 'hero-meta-num']) {
    if (!t.ignore.class.includes(cls)) t.ignore.class.push(cls)
  }
  t.listener.start() // 客户端路由跳转后的新内容也自动翻
  // changeLanguage 是官方的一键切换 API：设置目标语言并立即执行翻译
  t.changeLanguage('english')
  // 官方通道整页通常 1-3 秒；横幅最多挂 8 秒自动消失
  if (!silent) hideBanner(8000)
}

/**
 * 中/英一键切换按钮（ThemeToggle 右边）
 * - 点 EN：动态加载 translate.js 就地翻译整页
 * - 点 中：清状态刷新回原文
 * - localStorage 持久化，翻页/回访保持
 */
const LangToggle = () => {
  const [isEn, setIsEn] = useState(false)
  const [busy, setBusy] = useState(false)

  // 回访恢复：上次选了 EN 就自动翻（静默，不打横幅）
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (localStorage.getItem(LANG_KEY) === 'en') {
      setIsEn(true)
      runTranslate({ silent: true }).catch(e => console.warn('[LangToggle]', e))
      return
    }
    // 空闲时预取 SDK 到浏览器 HTTP 缓存（低优先级，不执行脚本、不阻塞任何东西）
    // 点 EN 时 loadExternalResource 再插 <script>，直接命中缓存，省掉 1-3 秒下载
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
      localStorage.setItem(LANG_KEY, 'zh')
      // 清掉 translate.js 自己记住的目标语言，否则刷新后它可能自动再翻
      try { localStorage.removeItem('to') } catch (e) {}
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
