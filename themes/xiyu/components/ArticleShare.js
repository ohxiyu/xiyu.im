import { useEffect, useRef, useState } from 'react'

export default function ArticleShare({ post }) {
  const [status, setStatus] = useState('')
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    clearTimeout(timer.current)
    try {
      await navigator.clipboard.writeText(window.location.href)
      setStatus('已复制')
    } catch (_) {
      setStatus('复制失败，请复制地址栏')
    }
    timer.current = setTimeout(() => setStatus(''), 2400)
  }
  const share = platform => {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(post?.title || '')
    const href = platform === 'x'
      ? `https://x.com/intent/tweet?url=${url}&text=${text}`
      : `https://t.me/share/url?url=${url}&text=${text}`
    window.open(href, '_blank', 'noopener,noreferrer')
  }
  return (
    <div className='article-share' aria-label='分享文章'>
      <button type='button' onClick={copy}>复制链接</button>
      <button type='button' onClick={() => share('x')}>X <span aria-hidden='true'>↗</span></button>
      <button type='button' onClick={() => share('telegram')}>Telegram <span aria-hidden='true'>↗</span></button>
      <span className='share-status' role='status'>{status}</span>
    </div>
  )
}
