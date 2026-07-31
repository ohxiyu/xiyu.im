/**
 * 订单存储：用 Notion 官方 API 当订单表
 * - 防止同一笔 txHash 被多人重复使用
 * - 订单在 Notion 里可见可编辑，方便记账 / 手动补单
 *
 * 需要的 Notion 数据库字段：
 *   txHash  Title
 *   slug    Rich text
 *   chain   Select
 *   amount  Number
 *   payer   Rich text
 *
 * 用原生 fetch，零依赖
 */

const NOTION_VERSION = '2022-06-28'

const cfg = () => ({
  token: process.env.NOTION_API_KEY,
  dbId: process.env.PAYWALL_ORDERS_DB_ID
})

export function ordersEnabled() {
  const { token, dbId } = cfg()
  return Boolean(token && dbId)
}

async function notion(path, body) {
  const { token } = cfg()
  const res = await fetch(`https://api.notion.com/v1${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Notion ${path} HTTP ${res.status} ${text.slice(0, 200)}`)
  }
  return res.json()
}

/**
 * 这笔交易是否已被用过
 * 未配置订单表时返回 false（不去重，功能仍可用）
 */
export async function isTxUsed(txHash) {
  if (!ordersEnabled()) return false
  const { dbId } = cfg()
  try {
    const data = await notion(`/databases/${dbId}/query`, {
      filter: {
        property: 'txHash',
        title: { equals: txHash }
      },
      page_size: 1
    })
    return Array.isArray(data.results) && data.results.length > 0
  } catch (e) {
    console.warn('[paywall] isTxUsed failed:', e?.message || e)
    // 查询失败时不阻断付款（宁可漏去重，也不让付了钱的人打不开）
    return false
  }
}

/** 记一笔订单 */
export async function recordOrder({ txHash, slug, chain, amount, payer }) {
  if (!ordersEnabled()) return false
  const { dbId } = cfg()
  try {
    await notion('/pages', {
      parent: { database_id: dbId },
      properties: {
        txHash: { title: [{ text: { content: txHash } }] },
        slug: { rich_text: [{ text: { content: slug || '' } }] },
        chain: { select: { name: chain } },
        amount: { number: Number(amount) || 0 },
        payer: { rich_text: [{ text: { content: payer || '' } }] }
      }
    })
    return true
  } catch (e) {
    console.warn('[paywall] recordOrder failed:', e?.message || e)
    return false
  }
}
