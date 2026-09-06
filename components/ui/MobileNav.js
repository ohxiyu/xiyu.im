import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

/**
 * 移动端导航的触发器（轻的那半）。
 *
 * 汉堡按钮必须进首屏——它是导航栏布局的一部分，懒加载会让导航闪一下。
 * 抽屉本体（Radix Dialog）在首次点击时才加载。
 */
const MobileNavDrawer = dynamic(() => import('./MobileNavDrawer'), { ssr: false })

export default function MobileNav({ links = [], tools = null }) {
  const [open, setOpen] = useState(false)
  const [everOpened, setEverOpened] = useState(false)

  useEffect(() => {
    if (open) setEverOpened(true)
  }, [open])

  return (
    <>
      <button
        type='button'
        className='theme-toggle nav-menu-toggle'
        aria-label='打开菜单'
        aria-expanded={open}
        onClick={() => setOpen(true)}>
        <svg width='17' height='17' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' aria-hidden='true'>
          <path d='M5 7h14M5 12h14M5 17h14' />
        </svg>
      </button>

      {everOpened && (
        <MobileNavDrawer
          links={links}
          tools={tools}
          open={open}
          onOpenChange={setOpen}
        />
      )}
    </>
  )
}
