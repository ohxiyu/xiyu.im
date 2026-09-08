import SmartLink from '@/components/SmartLink'
import { Card } from '@/components/ui/card'
import { formatNum } from '../lib/format'

// 文章底部上一篇/下一篇
const PrevNext = ({ prev, next }) => {
  if (!prev && !next) return null
  return (
    <div className='prev-next'>
      {prev ? (
        <SmartLink href={prev.href || `/${prev.slug}`} className='pn-link'>
          <Card className='pn-card'>
            <div className='pn-label'>← 上一篇{formatNum(prev) && ` · #${formatNum(prev)}`}</div>
            <div className='pn-title'>{prev.title}</div>
          </Card>
        </SmartLink>
      ) : (
        <span className='pn-placeholder' aria-hidden='true' />
      )}
      {next ? (
        <SmartLink href={next.href || `/${next.slug}`} className='pn-link pn-right'>
          <Card className='pn-card'>
            <div className='pn-label'>下一篇{formatNum(next) && ` · #${formatNum(next)}`} →</div>
            <div className='pn-title'>{next.title}</div>
          </Card>
        </SmartLink>
      ) : (
        <span className='pn-placeholder' aria-hidden='true' />
      )}
    </div>
  )
}

export default PrevNext
