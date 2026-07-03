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

// 翻到英文（幂等）
const runTranslate = async () => {
  const t = await loadSDK()
  if (!t) throw new Error('translate.js unavailable')
  t.language.setLocal('chinese_simplified')
  t.service.use('client.edge') // 免费微软翻译通道，无需 key
  t.selectLanguageTag.show = false // 禁用它自带的语言下拉
  // 代码块和等宽内容不翻译
  for (const cls of ['notion-code', 'post-num', 'post-date', 'brand-tag', 'hero-meta-num']) {
    if (!t.ignore.class.includes(cls)) t.ignore.class.push(cls)
  }
  t.listener.start() // 客户端路由跳转后的新内容也自动翻
  // changeLanguage 是官方的一键切换 API：设置目标语言并立即执行翻译
  t.changeLanguage('english')
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

  // 回访恢复：上次选了 EN 就自动翻
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (localStorage.getItem(LANG_KEY) === 'en') {
      setIsEn(true)
      runTranslate().catch(e => console.warn('[LangToggle]', e))
    }
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
