import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * shadcn/ui 的类名合并工具。
 *
 * clsx 负责条件类名，tailwind-merge 负责让后写的工具类真正覆盖先写的
 * （例如 cn('px-4', 'px-2') 得到 'px-2'，而不是两个都留下让 CSS 优先级决定）。
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export default cn
