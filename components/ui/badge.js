import { cx } from '@/lib/cx'
import { cva } from 'class-variance-authority'

/**
 * Badge —— shadcn 的 variant 结构，xiyu 的令牌。
 *
 * 圆角用站点最小的 --r-xs（4px），和既有的 .tag 保持一致；
 * 不用 shadcn 默认的全圆角胶囊。
 */
const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-xs border border-transparent px-2 py-0.5 text-[11.5px] font-medium leading-normal whitespace-nowrap',
  {
    variants: {
      variant: {
        secondary: 'bg-tagc-bg text-tagc-ink',
        outline: 'border-rule text-ink-mute',
        accent: 'bg-selection text-accent-ink'
      }
    },
    defaultVariants: { variant: 'secondary' }
  }
)

export function Badge({ className, variant, ...props }) {
  return <span className={cx(badgeVariants({ variant }), className)} {...props} />
}

export { badgeVariants }
export default Badge
