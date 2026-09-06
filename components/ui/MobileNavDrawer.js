import SmartLink from '@/components/SmartLink'
import { cn } from '@/lib/cn'
import * as Dialog from '@radix-ui/react-dialog'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

/**
 * 移动端抽屉导航的本体（重的那半）。
 *
 * 由 MobileNav.js 在首次点击汉堡按钮时才 dynamic() 进来。
 *
 * 替换掉原先手写的 .nav-menu-toggle + .nav-primary.is-open：
 * 那套实现没有焦点陷阱、Esc 不关闭、打开时背景仍能滚动。
 * Radix Dialog 这四件事都自带。
 *
 * links: [{ key, href, label, external? }]
 */
export default function MobileNavDrawer({ links = [], tools = null, open, onOpenChange }) {
  const router = useRouter()

  // 路由变化后自动收起
  useEffect(() => onOpenChange(false), [router?.asPath, onOpenChange])

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
          className={cn(
            'fixed right-0 top-0 z-[100] flex h-full w-[min(300px,84vw)] flex-col',
            'border-l border-rule bg-paper-elev px-[22px] py-[22px]',
            'data-[state=open]:animate-in data-[state=open]:slide-in-from-right',
            'data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right',
            'duration-[260ms]'
          )}>
          <div className='mb-[18px] flex items-center justify-between'>
            <Dialog.Title className='font-xiyu-serif text-[17px] font-semibold text-ink'>
              菜单
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type='button'
                aria-label='关闭菜单'
                className='rounded-sm p-1 text-ink-mute transition-colors hover:text-accent-ink'>
                <svg width='17' height='17' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' aria-hidden='true'>
                  <path d='m6 6 12 12M18 6 6 18' />
                </svg>
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Description className='sr-only'>站点主导航</Dialog.Description>

          <nav className='flex flex-col'>
            {links.map((link, index) => {
              const content = (
                <>
                  <span className='w-6 shrink-0 font-xiyu-mono text-[10px] text-ink-faint'>
                    {link.external ? '↗' : String(index + 1).padStart(2, '0')}
                  </span>
                  <span>{link.label}</span>
                </>
              )
              const className = cn(
                'flex items-center gap-[11px] rounded-sm border-b border-rule-soft',
                'px-2 py-[11px] text-[14.5px] text-ink-soft no-underline',
                'transition-all duration-150 hover:pl-[13px] hover:text-accent-ink'
              )
              return link.external
                ? (
                  <a
                    key={link.key}
                    href={link.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className={className}>
                    {content}
                  </a>
                  )
                : (
                  <SmartLink key={link.key} href={link.href} className={className}>
                    {content}
                  </SmartLink>
                  )
            })}
          </nav>

          {tools && (
            <div className='mt-auto flex items-center gap-2 border-t border-rule pt-4'>
              {tools}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
