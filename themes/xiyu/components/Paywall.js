import { useEffect, useState } from 'react'

const tokenKey = slug => `xiyu_unlock_${slug}`

/**
 * 付费墙
 * - 展示预览段落 + 收款信息
 * - 用户粘贴 TX Hash → /api/unlock 验证 → 回调把正文交给父组件渲染
 * - 成功后凭证存 localStorage，回访自动解锁
 */
const Paywall = ({ post, onUnlock }) => {
  const pw = post?.paywall
  const chains = pw?.chains || []
  const [chain, setChain] = useState(chains[0]?.id || 'bsc')
  const [hash, setHash] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')

  const active = chains.find(c => c.id === chain) || chains[0]

  // 回访自动解锁
  useEffect(() => {
    if (typeof window === 'undefined' || !post?.slug) return
    const saved = localStorage.getItem(tokenKey(post.slug))
    if (!saved) return
    ;(async () => {
      try {
        const res = await fetch('/api/unlock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug: post.slug, token: saved })
        })
        const data = await res.json()
        if (data.ok && data.blockMap) onUnlock(data.blockMap)
        else localStorage.removeItem(tokenKey(post.slug)) // 凭证失效就清掉
      } catch (e) {
        /* 网络异常保持锁定，用户可手动重试 */
      }
    })()
  }, [post?.slug])

  const copy = async (text, what) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(what)
      setTimeout(() => setCopied(''), 1600)
    } catch (e) { /* 剪贴板不可用时用户可手动选中 */ }
  }

  const submit = async e => {
    e.preventDefault()
    if (busy) return
    const tx = hash.trim()
    if (!tx) return setError('请填写付款交易哈希')
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: post.slug, chain, txHash: tx })
      })
      const data = await res.json()
      if (data.ok && data.blockMap) {
        localStorage.setItem(tokenKey(post.slug), data.token)
        onUnlock(data.blockMap)
      } else {
        setError(data.error || '验证失败，请稍后重试')
      }
    } catch (e) {
      setError('网络异常，请稍后重试')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className='paywall'>
      {/* 预览正文 */}
      {pw?.preview?.length > 0 && (
        <div className='paywall-preview'>
          {pw.preview.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      )}

      <div className='paywall-card'>
        <div className='eyebrow'>Paid · 付费阅读</div>
        <h3 className='paywall-price'>
          {pw?.price}<span className='paywall-currency'>USDT</span>
        </h3>
        <p className='paywall-desc'>
          转账后把交易哈希粘贴到下方，即可永久解锁本文。
        </p>

        {chains.length === 0 && (
          <p className='paywall-error'>收款地址未配置，请联系站长。</p>
        )}

        {chains.length > 0 && (
          <>
            <div className='paywall-tabs' role='tablist' aria-label='选择付款链'>
              {chains.map(c => (
                <button
                  key={c.id}
                  role='tab'
                  aria-selected={chain === c.id}
                  className={'paywall-tab' + (chain === c.id ? ' active' : '')}
                  onClick={() => setChain(c.id)}>
                  {c.name}
                </button>
              ))}
            </div>

            <div className='paywall-field'>
              <span className='paywall-field-label'>收款地址</span>
              <code className='paywall-addr'>{active?.address}</code>
              <button
                type='button'
                className='paywall-copy'
                onClick={() => copy(active?.address, 'addr')}>
                {copied === 'addr' ? '已复制' : '复制'}
              </button>
            </div>

            <div className='paywall-field'>
              <span className='paywall-field-label'>金额</span>
              <code className='paywall-addr'>{pw?.price} USDT</code>
              <button
                type='button'
                className='paywall-copy'
                onClick={() => copy(String(pw?.price), 'amt')}>
                {copied === 'amt' ? '已复制' : '复制'}
              </button>
            </div>

            <form onSubmit={submit} className='paywall-form'>
              <input
                className='paywall-input'
                value={hash}
                onChange={e => setHash(e.target.value)}
                placeholder='粘贴付款交易哈希（TX Hash）'
                spellCheck={false}
                disabled={busy}
              />
              <button className='btn-ghost paywall-submit' disabled={busy}>
                {busy ? '验证中…' : '解锁全文'}
              </button>
            </form>

            {error && <p className='paywall-error'>{error}</p>}
            <p className='paywall-hint'>
              付款后通常几十秒内可验证。链上确认较慢时，稍等片刻再点解锁。
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default Paywall
