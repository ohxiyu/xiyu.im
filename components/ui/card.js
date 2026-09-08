import { cx } from '@/lib/cx'
import { forwardRef } from 'react'

/**
 * Card —— shadcn 的组合结构，xiyu 的令牌。
 *
 * 用法与 shadcn 一致：
 *   <Card>
 *     <CardHeader><CardTitle/><CardDescription/></CardHeader>
 *     <CardContent/>
 *     <CardFooter/>
 *   </Card>
 *
 * 圆角走站点统一的 --r-md（12px），颜色全部来自 public/css/xiyu.css
 * 末尾的令牌桥，因此明暗两套自动跟随 html.dark。
 */

const Card = forwardRef(function Card({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cx(
        'overflow-hidden rounded-md border border-rule bg-paper-elev',
        className
      )}
      {...props}
    />
  )
})

const CardHeader = forwardRef(function CardHeader({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cx('flex flex-col gap-1.5 px-[22px] pt-[22px]', className)}
      {...props}
    />
  )
})

const CardTitle = forwardRef(function CardTitle({ className, as: As = 'h3', ...props }, ref) {
  return (
    <As
      ref={ref}
      className={cx(
        'm-0 text-[15px] font-semibold leading-snug tracking-[-.01em] text-ink',
        className
      )}
      {...props}
    />
  )
})

const CardDescription = forwardRef(function CardDescription({ className, ...props }, ref) {
  return (
    <p
      ref={ref}
      className={cx('m-0 text-[13px] leading-relaxed text-ink-mute', className)}
      {...props}
    />
  )
})

const CardContent = forwardRef(function CardContent({ className, ...props }, ref) {
  return <div ref={ref} className={cx('px-[22px] py-[18px]', className)} {...props} />
})

const CardFooter = forwardRef(function CardFooter({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cx(
        'flex flex-wrap items-center gap-2 border-t border-rule-soft bg-tagc-bg/40 px-[22px] py-[13px]',
        className
      )}
      {...props}
    />
  )
})

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
export default Card
