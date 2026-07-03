import { useEffect, useState } from 'react'
import { loadExternalResource } from '@/lib/utils'

const LANG_KEY = 'xiyu_lang'
const TRANSLATE_SDK = 'https://res.zvo.cn/translate/translate.js'

// 初始化 translate.js 并翻到英文（幂等，可重复调用）
const runTranslate = async () => {
  await loadExternalResource(TRANSLATE_SDK, 'js')
  const t = window.translate
  if (!t) throw new Error('translate.js load failed')
  t.language.setLocal('chinese_simplified')
  t.service.use('client.edge') // 免费微软翻译通道，无需 key
  t.selectLanguageTag.show = false // 不要它自带的语言下拉
  t.listener.start() // 监听后续 DOM 变化（客户端路由跳转后的新内容也翻）
  // 代码块和等宽内容不翻译
  for (const cls of ['notion-code', 'post-num', 'post-date', 'brand-tag', 'hero-meta-num']) {
    if (!t.ignore.class.includes(cls)) t.ignore.class.push(cls)
  }
  t.to = 'english'
  t.execute()
}

/**
 * 中/英一键切换按钮（放在 ThemeToggle 右边）
 * - 点 EN：动态加载 translate.js（约 40KB，只在需要时加载）就地翻译整页
 * - 点 中：清状态并刷新回原文
 * - 选择持久化到 localStorage，翻页/回访保持
 */
const LangToggle = () => {
  const [isEn, setIsEn] = useState(false)

  // 回访恢复：上次选了 EN 就自动翻
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (localStorage.getItem(LANG_KEY) === 'en') {
      setIsEn(true)
      runTranslate().catch(e => console.warn('[LangToggle]', e))
    }
  }, [])

  const toggle = () => {
    if (isEn) {
      localStorage.setItem(LANG_KEY, 'zh')
      // translate.js 就地改写了 DOM，恢复原文最可靠的方式是刷新
      window.location.reload()
    } else {
      localStorage.setItem(LANG_KEY, 'en')
      setIsEn(true)
      runTranslate().catch(e => {
        console.warn('[LangToggle]', e)
        localStorage.setItem(LANG_KEY, 'zh')
        setIsEn(false)
      })
    }
  }

  return (
    <button
      className='theme-toggle lang-toggle'
      onClick={toggle}
      title={isEn ? '切回中文' : 'Translate to English'}
      aria-label={isEn ? '切回中文' : 'Translate to English'}>
      <span className='lang-toggle-text'>{isEn ? '中' : 'EN'}</span>
    </button>
  )
}

export default LangToggle
