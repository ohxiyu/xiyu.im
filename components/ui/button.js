import { cn } from '@/lib/cn'
import { cva } from 'class-variance-authority'
import { forwardRef } from 'react'

/**
 * Button —— shadcn 的结构，xiyu 的皮。
 *
 * 和 shadcn 默认样式的三处刻意偏离：
 * 1. 圆角走站点统一的 --r-* 尺度（rounded-sm = 8px），不用 Tailwind 默认值。
 * 2. 主色是站点的橙 (--accent)，不是 shadcn 的中性主色。
 * 3. 悬停只改颜色，不加阴影、不位移——与 .nav-link、.tag 的手感一致。
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-sm border font-medium leading-tight transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
  {
    variants: {
      variant: {
        primary: 'border-accent bg-accent text-white hover:border-accent-ink hover:bg-accent-ink',
        outline: 'border-rule bg-transparent text-ink hover:border-accent hover:text-accent-ink',
        ghost: 'border-transparent bg-transparent text-ink-mute hover:bg-tagc-bg hover:text-accent-ink',
        link: 'border-transparent bg-transparent text-ink-mute underline-offset-4 hover:text-accent-ink hover:underline'
      },
      size: {
        sm: 'px-[11px] py-[5px] text-xs',
        md: 'px-4 py-2 text-[13px]',
        icon: 'h-8 w-8 p-0'
      }
    },
    defaultVariants: { variant: 'outline', size: 'md' }
  }
)

const Button = forwardRef(function Button(
  { className, variant, size, type = 'button', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
})

export { Button, buttonVariants }
export default Button
