import { useEffect, useState } from 'react'

// 左侧目录：消费 NotionNext 的 post.toc 数组（或 blockMap headings）
// toc 项典型形状：{ id, text, indentLevel }
const TOC = ({ toc }) => {
  const [activeId, setActiveId] = useState('')
  const items = Array.isArray(toc) ? toc : []

  useEffect(() => {
    if (!items.length || typeof window === 'undefined') return
    const handler = () => {
      let current = ''
      const y = window.scrollY + 120
      for (const it of items) {
        const el = document.getElementById(it.id)
        if (el && el.offsetTop <= y) current = it.id
      }
      if (current && current !== activeId) setActiveId(current)
    }
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [items, activeId])

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
