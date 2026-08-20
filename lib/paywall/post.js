/**
 * 付费文章的服务端处理：判定价格、抽取预览、剥离正文
 *
 * Notion 自定义列会被 getPageProperties 直接挂在 post 上（post[列名]），
 * 所以只要在 Notion 数据库加一个数字/文本列 `price`，这里就能读到。
 */
import { getPublicChainInfo } from './chains'

/** 读取文章售价，返回数字；非付费文章返回 0 */
export function getPostPrice(post) {
  const raw =
    post?.price ??
    post?.Price ??
    post?.pageProperties?.price ??
    post?.pageProperties?.Price
  const n = parseFloat(String(raw ?? '').replace(/[^\d.]/g, ''))
  return Number.isFinite(n) && n > 0 ? n : 0
}

/**
 * 从 blockMap 抽前 N 个文本段落作为预览
 * 只取纯文本，不含图片/代码/嵌入，避免泄漏正文结构
 */
export function extractPreview(post, maxBlocks = 2) {
  try {
    const blocks = post?.blockMap?.block
    if (!blocks || !post?.id) return []
    const ids = blocks[post.id]?.value?.content || []
    const out = []
    for (const id of ids) {
      if (out.length >= maxBlocks) break
      const b = blocks[id]?.value
      if (!b || b.type !== 'text') continue
      const title = b.properties?.title
      if (!Array.isArray(title)) continue
      const text = title.map(t => String(t?.[0] ?? '')).join('').trim()
      if (text) out.push(text)
    }
    return out
  } catch (e) {
    return []
  }
}

/**
 * 对付费文章执行「剥离」：
 * - 删除 blockMap / content / toc（正文绝不下发到浏览器）
 * - 挂上 paywall 元信息供前端渲染付费墙
 *
 * ⚠️ 这是付费墙的安全核心：不剥离的话正文会出现在 __NEXT_DATA__ 里，付不付费都能看
 */
export function applyPaywall(props, { previewBlocks = 2 } = {}) {
  const post = props?.post
  if (!post) return props

  const price = getPostPrice(post)
  if (price <= 0) return props // 免费文章原样返回

  // 没有配置任何收款地址时，绝不剥离正文。
  // 否则前端拿不到可付款的链 → 读者无法解锁 → 文章变成谁都打不开的死页面，
  // 连站长自己也看不到，且没有任何自救路径。宁可暂时免费，也不能把文章弄丢。
  const chains = getPublicChainInfo()
  if (chains.length === 0) {
    console.warn(
      '[paywall] 文章设置了 price 但未配置任何收款地址，暂按免费文章处理。' +
        '请配置 PAYWALL_EVM_ADDRESS 或 PAYWALL_TRON_ADDRESS 后再启用付费。'
    )
    return props
  }

  const preview = extractPreview(post, previewBlocks)

  post.paywall = {
    price,
    currency: 'USDT',
    preview,
    // 正文总段数，前端可提示「剩余 N 段」
    totalBlocks: post?.blockMap?.block?.[post.id]?.value?.content?.length || 0,
    // 可用链与收款地址（服务端读 env，随 props 下发给前端渲染）
    chains
  }

  // 彻底剥离正文
  delete post.blockMap
  delete post.content
  delete post.toc
  post.wordCount = 0
  post.readTime = 0

  // 上一篇/下一篇里也可能带正文，一并清理
  for (const key of ['prev', 'next']) {
    if (props[key]?.blockMap) delete props[key].blockMap
  }
  return props
}
