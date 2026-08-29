import { useEffect, useRef, useState } from 'react'

// 左侧目录：消费 NotionNext 的 post.toc 数组（或 blockMap headings）
// toc 项典型形状：{ id, text, indentLevel }
const TOC = ({ toc }) => {
  const [activeId, setActiveId] = useState('')
  const items = Array.isArray(toc) ? toc : []
  // items 每次 render 是新数组、activeId 高频变化，都不能进 effect deps，
  // 否则每滚一格就重新注册 scroll 监听。用 ref 透传，effect 只随文章变化重建。
  const itemsRef = useRef(items)
  itemsRef.current = items

  useEffect(() => {
    if (!itemsRef.current.length || typeof window === 'undefined') return
    let raf = 0
    const handler = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        let current = ''
        const y = window.scrollY + 120
        for (const it of itemsRef.current) {
          const el = document.getElementById(it.id)
          if (el && el.offsetTop <= y) current = it.id
        }
        if (current) setActiveId(prev => (prev === current ? prev : current))
      })
    }
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', handler)
    }
  }, [toc])

  if (!items.length) return null

  return (
    <aside className='toc'>
      <div className='toc-label'>Contents</div>
      <ul className='toc-list'>
        {items.map(it => (
          <li key={it.id} style={it.indentLevel > 0 ? { paddingLeft: `${it.indentLevel * 12}px` } : undefined}>
            <a
              href={`#${it.id}`}
              className={'toc-link' + (activeId === it.id ? ' active' : '')}>
              {it.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default TOC
