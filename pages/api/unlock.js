/**
 * 付费文章解锁 API
 *
 * 两种调用方式：
 *   1) { slug, chain, txHash }  首次付款解锁：验链上转账 → 去重 → 记订单 → 发凭证
 *   2) { slug, token }          回访自动解锁：校验凭证
 *
 * 成功统一返回 { ok:true, token, blockMap }
 * 正文 blockMap 只在这里返回，绝不出现在静态页面里
 */
import { resolvePostProps } from '@/lib/db/SiteDataApi'
import { fetchNotionPageBlocks, formatNotionBlock } from '@/lib/db/notion/getPostBlocks'
import { adapterNotionBlockMap } from '@/lib/utils/notion.util'
import { getPostPrice } from '@/lib/paywall/post'
import { verifyPayment } from '@/lib/paywall/verify'
import { signToken, verifyToken } from '@/lib/paywall/token'
import { isTxUsed, recordOrder } from '@/lib/paywall/orders'
import { CHAINS } from '@/lib/paywall/chains'

// slug 来自请求体，限制长度与段数，避免异常输入一路带进下游
const MAX_SLUG_LEN = 200
const MAX_SLUG_SEGMENTS = 6

/** 请求体里的 slug 是否是合理的文章路径 */
function isValidSlug(slug) {
  if (typeof slug !== 'string') return false
  const s = slug.trim()
  if (!s || s.length > MAX_SLUG_LEN) return false
  // 不允许控制字符、反斜杠、以及 ../ 之类的路径穿越
  if (/[\x00-\x1f\x7f\\]/.test(s)) return false
  if (s.includes('..')) return false
  return s.split('/').filter(Boolean).length <= MAX_SLUG_SEGMENTS
}

/** 按 slug 找到这篇文章（未剥离的原始数据） */
async function findPaidPost(slug) {
  const segments = String(slug || '').split('/').filter(Boolean)
  const props = await resolvePostProps({
    prefix: segments[0],
    slug: segments[1],
    suffix: segments.slice(2),
    from: 'paywall-unlock'
  })
  return props?.post || null
}

/** 单独拉正文（resolvePostProps 已对付费文章剥离了 blockMap） */
async function loadBlockMap(postId) {
  const raw = await fetchNotionPageBlocks(postId, 'paywall-content')
  const adapted = adapterNotionBlockMap(raw)
  return { ...adapted, block: formatNotionBlock(adapted.block) }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' })
  }
  // 解锁结果因人而异，禁止任何中间层缓存
  res.setHeader('Cache-Control', 'no-store, max-age=0')

  try {
    const { slug, chain, txHash, token } = req.body || {}
    if (!slug) return res.status(400).json({ ok: false, error: '缺少 slug' })
    if (!isValidSlug(slug)) {
      return res.status(400).json({ ok: false, error: '文章路径不合法' })
    }

    const post = await findPaidPost(slug)
    if (!post) return res.status(404).json({ ok: false, error: '文章不存在' })

    const price = post.paywall?.price ?? getPostPrice(post)
    if (!price) {
      return res.status(400).json({ ok: false, error: '这篇文章无需付费' })
    }

    // —— 路径 1：已有凭证，直接放行 ——
    if (token) {
      const payload = verifyToken(token)
      if (payload && payload.slug === slug) {
        const blockMap = await loadBlockMap(post.id)
        return res.status(200).json({ ok: true, token, blockMap })
      }
      return res.status(401).json({ ok: false, error: '凭证无效或已过期' })
    }

    // —— 路径 2：首次付款 ——
    if (!chain || !CHAINS[chain]) {
      return res.status(400).json({ ok: false, error: '请选择付款链' })
    }
    if (!txHash) {
      return res.status(400).json({ ok: false, error: '请填写交易哈希' })
    }

    const normalizedHash = String(txHash).trim().toLowerCase()

    // 先查是否被用过，避免把已用过的 hash 再打一次 RPC
    if (await isTxUsed(normalizedHash)) {
      return res.status(409).json({
        ok: false,
        error: '这笔交易已被使用过。如果你确实刚付款，请确认哈希填写正确。'
      })
    }

    const result = await verifyPayment({
      chainId: chain,
      txHash: normalizedHash,
      minAmount: price
    })
    if (!result.ok) {
      return res.status(400).json({ ok: false, error: result.reason })
    }

    // 记订单（失败不阻断，付了钱的人必须能看到文章）
    await recordOrder({
      txHash: normalizedHash,
      slug,
      chain,
      amount: result.amount,
      payer: result.from
    })

    const expiresInSec = Number(process.env.PAYWALL_TOKEN_TTL_SEC || 0) || null
    const newToken = signToken(
      { slug, txHash: normalizedHash, chain },
      expiresInSec
    )
    const blockMap = await loadBlockMap(post.id)

    return res.status(200).json({ ok: true, token: newToken, blockMap })
  } catch (e) {
    console.error('[paywall/unlock]', e?.message || e)
    return res.status(500).json({ ok: false, error: '服务异常，请稍后重试' })
  }
}
