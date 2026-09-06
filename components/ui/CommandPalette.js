import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

/**
 * ⌘K 命令面板的触发器（轻的那半）。
 *
 * 只包含一个按钮和一个键盘监听——这两样必须进首屏，因为快捷键要随时可用。
 * 真正的对话框（Radix Dialog + cmdk，约 50 kB）在首次打开时才加载，
 * 所以首屏 JS 基本不受影响。
 *
 * 之所以拆成两个文件而不是整体 dynamic()：整体懒加载会让触发按钮
 * 在 chunk 到达前不渲染，导航栏会闪一下。
 */
const CommandDialog = dynamic(() => import('./CommandDialog'), { ssr: false })

export default function CommandPalette({ posts = [] }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  // 一旦打开过就保持挂载，避免每次开关都重新拉 chunk
  const [everOpened, setEverOpened] = useState(false)

  useEffect(() => {
    if (open) setEverOpened(true)
  }, [open])

  // 关闭后清空搜索词，下次打开是干净的
  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  useEffect(() => {
    const onKeyDown = event => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen(prev => !prev)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <>
      <button
        type='button'
        onClick={() => setOpen(true)}
        aria-label='搜索文章'
        className='xiyu-cmd-trigger'>
        <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' aria-hidden='true'>
          <circle cx='11' cy='11' r='7' />
          <line x1='21' y1='21' x2='16.65' y2='16.65' />
        </svg>
        <span className='xiyu-cmd-trigger-label'>搜索</span>
        <kbd className='xiyu-kbd' aria-hidden='true'>⌘K</kbd>
      </button>

      {everOpened && (
        <CommandDialog
          posts={posts}
          open={open}
          onOpenChange={setOpen}
          query={query}
          setQuery={setQuery}
        />
      )}
    </>
  )
}
