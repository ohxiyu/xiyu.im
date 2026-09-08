import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * cn —— shadcn 标准的类名合并：clsx 处理条件类名，tailwind-merge 让后写的
 * 工具类真正覆盖先写的（cn('px-4','px-2') → 'px-2'）。
 *
 * ⚠️ tailwind-merge 不小（实测把它拉进首屏共享 chunk 会让 First Load JS 涨 12 kB）。
 * 只在**懒加载**的组件里用它——CommandDialog、MobileNavDrawer 这类。
 * 会进首屏的组件请用 lib/cx.js 的 cx。
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export default cn
