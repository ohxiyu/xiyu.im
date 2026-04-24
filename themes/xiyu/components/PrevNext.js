import SmartLink from '@/components/SmartLink'

// 文章底部上一篇/下一篇卡
const PrevNext = ({ prev, next }) => {
  const formatNum = p => {
    const raw = p?.pageProperties?.num ?? p?.pageProperties?.Num
    return raw ? String(raw).padStart(4, '0') : ''
  }
  return (
    <div className='prev-next'>
      {prev ? (
        <SmartLink href={prev.href || `/${prev.slug}`} className='pn-card'>
          <div className='pn-label'>← 上一篇{formatNum(prev) && ` · #${formatNum(prev)}`}</div>
          <div className='pn-title'>{prev.title}</div>
        </SmartLink>
      ) : (
        <div className='pn-card' style={{ visibility: 'hidden' }} aria-hidden />
      )}
      {next ? (
        <SmartLink href={next.href || `/${next.slug}`} className='pn-card pn-right'>
          <div className='pn-label'>下一篇{formatNum(next) && ` · #${formatNum(next)}`} →</div>
          <div className='pn-title'>{next.title}</div>
        </SmartLink>
      ) : (
        <div className='pn-card pn-right' style={{ visibility: 'hidden' }} aria-hidden />
      )}
    </div>
  )
}

export default PrevNext
