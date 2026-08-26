import { useCallback, useEffect, useMemo, useState } from 'react'

const ShareActions = ({ post, compact = false }) => {
  const [copied, setCopied] = useState(false)
  const [pageUrl, setPageUrl] = useState('')

  useEffect(() => {
    setPageUrl(window.location.href)
  }, [])

  const twitterShare = useMemo(() => {
    if (!pageUrl) return '#'
    const url = encodeURIComponent(pageUrl)
    const text = encodeURIComponent(post?.title || '')
    return `https://twitter.com/intent/tweet?url=${url}&text=${text}`
  }, [pageUrl, post?.title])

  const copyLink = useCallback(async () => {
    if (typeof window === 'undefined') return
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch (_) {}
  }, [])

  const nativeShare = useCallback(async () => {
    if (typeof window === 'undefined') return
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title || document.title,
          url: window.location.href
        })
        return
      } catch (_) {}
    }
    await copyLink()
  }, [copyLink, post?.title])

  return (
    <div className={`share-actions${compact ? ' is-compact' : ''}`}>
      <a href={twitterShare} target='_blank' rel='noopener noreferrer'>
        X
      </a>
      <button type='button' onClick={() => { void copyLink() }}>
        {copied ? '已复制' : '复制链接'}
      </button>
      <button type='button' className='share-native' onClick={() => { void nativeShare() }}>
        分享
      </button>
    </div>
  )
}

export default ShareActions
