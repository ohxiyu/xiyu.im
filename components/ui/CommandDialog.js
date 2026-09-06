import { cn } from '@/lib/cn'
import * as Dialog from '@radix-ui/react-dialog'
import { Command } from 'cmdk'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'

/**
 * ⌘K 命令面板的对话框本体（重的那半）。
 *
 * 由 CommandPalette.js 在首次打开时才 dynamic() 进来，
 * 因此这里的 Radix Dialog + cmdk 不会进入首屏的 _app chunk。
 *
 * 为什么用 Radix Dialog 而不是自己写一个浮层：焦点陷阱、Esc 关闭、
 * 打开时锁滚动、aria-modal、还原焦点到触发元素——这些手写很难做全。
 * cmdk 负责筛选与方向键导航。
 *
 * 注意：Dialog 的内容渲染在 document.body 下的 portal 里，不在
 * #theme-xiyu 内部，所以这里用到的颜色令牌必须在 :root 上有定义。
 * public/css/xiyu.css 末尾的「Tailwind 令牌桥」正是为此存在。
 */

const MAX_RESULTS = 40

/** 无搜索词时展示的最近文章条数 */
const RECENT_COUNT = 7

const normalize = value => (typeof value === 'string' ? value : '')

export default function CommandDialog({ posts = [], open, onOpenChange, query, setQuery }) {
  const router = useRouter()

  const items = useMemo(() => {
    return (posts || [])
      .filter(post => post && (post.title || post.slug))
      .map(post => ({
        id: post.id || post.slug,
        title: normalize(post.title) || normalize(post.slug),
        href: post.href || `/${post.slug}`,
        date: normalize(post.publishDay) || normalize(post.date?.start_date),
        tags: Array.isArray(post.tags) ? post.tags : [],
        category: normalize(post.category)
      }))
  }, [posts])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items.slice(0, RECENT_COUNT)
    return items
      .filter(item => {
        const haystack = [item.title, item.category, item.tags.join(' ')]
          .join(' ')
          .toLowerCase()
        return haystack.includes(q)
      })
      .slice(0, MAX_RESULTS)
  }, [items, query])

  const go = useCallback(
    href => {
      onOpenChange(false)
      if (href) router.push(href)
    },
    [router, onOpenChange]
  )

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay
            className={cn(
              'fixed inset-0 z-[90] bg-ink/40 backdrop-blur-[2px]',
              'data-[state=open]:animate-in data-[state=open]:fade-in-0',
              'data-[state=closed]:animate-out data-[state=closed]:fade-out-0'
            )}
          />
          <Dialog.Content
            aria-label='搜索文章'
            className={cn(
              'fixed left-1/2 top-[14vh] z-[100] w-[min(560px,calc(100vw-32px))] -translate-x-1/2',
              'overflow-hidden rounded-md border border-rule bg-paper-elev',
              'shadow-[0_18px_48px_rgba(26,22,18,.14)]',
              'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[.985]',
              'data-[state=closed]:animate-out data-[state=closed]:fade-out-0'
            )}>
            <Dialog.Title className='sr-only'>搜索文章</Dialog.Title>
            <Dialog.Description className='sr-only'>
              输入关键词筛选文章，方向键移动，回车打开，Esc 关闭
            </Dialog.Description>

            <Command shouldFilter={false} loop className='xiyu-cmd'>
              <div className='flex items-center gap-[10px] border-b border-rule px-4 py-[14px]'>
                <span aria-hidden='true' className='text-ink-faint'>
                  <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                    <circle cx='11' cy='11' r='7' />
                    <line x1='21' y1='21' x2='16.65' y2='16.65' />
                  </svg>
                </span>
                <Command.Input
                  value={query}
                  onValueChange={setQuery}
                  placeholder={`搜索 ${items.length} 篇文章…`}
                  className='flex-1 border-0 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-faint'
                />
                <kbd className='xiyu-kbd' aria-hidden='true'>Esc</kbd>
              </div>

              <Command.List className='max-h-[320px] overflow-y-auto p-[6px]'>
                <Command.Empty className='px-3 py-8 text-center text-sm text-ink-faint'>
                  没有匹配的文章
                </Command.Empty>

                {visible.length > 0 && (
                  <Command.Group
                    heading={query.trim() ? `匹配 ${visible.length} 篇` : '最近发布'}
                    className='xiyu-cmd-group'>
                    {visible.map(item => (
                      <Command.Item
                        key={item.id}
                        value={item.id}
                        onSelect={() => go(item.href)}
                        className='xiyu-cmd-item'>
                        <span className='xiyu-cmd-title'>{item.title}</span>
                        {item.date && <span className='xiyu-cmd-date'>{item.date}</span>}
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                {query.trim() && (
                  <Command.Group heading='更多' className='xiyu-cmd-group'>
                    <Command.Item
                      value='__all_results__'
                      onSelect={() => go(`/search/${encodeURIComponent(query.trim())}`)}
                      className='xiyu-cmd-item'>
                      <span className='xiyu-cmd-title'>
                        在搜索页查看「{query.trim()}」的全部结果
                      </span>
                      <span className='xiyu-cmd-date'>↗</span>
                    </Command.Item>
                  </Command.Group>
                )}
              </Command.List>

              <div className='flex gap-4 border-t border-rule px-4 py-[9px] font-xiyu-mono text-[10px] tracking-[.04em] text-ink-faint'>
                <span>↑↓ 移动</span>
                <span>↵ 打开</span>
                <span>Esc 关闭</span>
              </div>
            </Command>
          </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
  )
}
