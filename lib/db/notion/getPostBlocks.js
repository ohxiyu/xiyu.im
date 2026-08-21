import {
  getDataFromCache,
  getOrSetDataWithCache

} from '@/lib/cache/cache_manager'
import BLOG from '@/blog.config'
import { deepClone, delay } from '../../utils'
import notionAPI from '@/lib/db/notion/getNotionAPI'
import pLimit from 'p-limit'

// ⚠️ 全局并发限制。
// 原值 15 对 Notion 的非官方接口太猛，构建期批量取正文时会被 429。
// 这个接口没有公开配额，宁可慢一点也不要被限流——构建慢几十秒没关系，
// 被限流则整个构建失败。
const CONCURRENCY = Number(process.env.NOTION_CONCURRENCY) || 3
const limit = pLimit(CONCURRENCY)

// ⚠️ 每个请求之间的间隔（防 burst）
const REQUEST_INTERVAL = Number(process.env.NOTION_REQUEST_INTERVAL) || 250 // ms

// 429 重试上限。限流是暂时的，值得比一般错误多试几次
const MAX_RETRY = Number(process.env.NOTION_MAX_RETRY) || 6


/**
 * 获取文章内容块
 * @param {string} id
 * @param {*} from
 */
export async function fetchNotionPageBlocks(id, from = null) {
  const cacheKey = `page_block_${id}`

  const pageBlock = await getOrSetDataWithCache(
    cacheKey,
    async () => limit(() => getPageWithRetry(id, from))
  )

  if (!pageBlock) {
    console.warn('[getPage] empty pageBlock:', id)
    return null
  }

  return pageBlock
}

/**
 * 调用接口，失败会重试
 * @param {*} id
 * @param {*} retryAttempts
 */
export async function getPageWithRetry(id, from, retryAttempts = MAX_RETRY) {
  if (!retryAttempts || retryAttempts <= 0) {
    console.error('[请求失败]:', `from:${from}`, `id:${id}`)
    return null
  }

  console.log(
    '[API-->>请求]',
    `from:${from}`,
    `id:${id}`,
    retryAttempts < MAX_RETRY ? `剩余重试次数:${retryAttempts}` : ''
  )

  try {
    const start = Date.now()
    const pageData = await notionAPI.getPage(id)
    const end = Date.now()
    console.log('[API<<--响应]', `耗时:${end - start}ms - from:${from}`)
    return pageData
  } catch (e) {
    console.warn('[API<<--异常]:', e)

    // 403/401 是权限问题，重试多少次都不会好，而且下游只会报出
    // 「allPages and tagOptions should be arrays」这种毫无指向性的信息。
    // 这里把真正的原因直接说清楚。
    const status = e?.response?.status ?? e?.statusCode ?? e?.status
    const msg = String(e?.message || '')
    if (status === 403 || status === 401 || /\b(403|401)\b/.test(msg)) {
      console.error(
        `[Notion] ❌ NOTION_ACCESS_DENIED (${status || '403/401'}) id="${id}" — ` +
          'Notion 拒绝了这次读取，重试无效。依次检查：' +
          '1) 该 Notion 页面是否仍处于「分享到网络 / Share to web」状态；' +
          '2) NOTION_PAGE_ID 是否与实际页面一致；' +
          '3) 若页面必须保持私有，或 Notion 对机房 IP 返回 403，' +
          '请在 Vercel 配置 NOTION_TOKEN_V2（浏览器 Cookie 里的 token_v2）。'
      )
      // 权限问题不重试，直接退出，避免把构建时间浪费在必然失败的重试上
      const cached = await getDataFromCache('page_block_' + id)
      return cached || null
    }

    // 429 是限流：必须退避后再试。
    // 此前这里是立刻重试，等于在被限流时继续加压，只会让情况更糟。
    if (status === 429 || /\b429\b/.test(msg)) {
      // 优先听服务端的 Retry-After（秒）
      const retryAfterRaw =
        e?.response?.headers?.get?.('retry-after') ?? e?.response?.headers?.['retry-after']
      const retryAfterMs = Number(retryAfterRaw) > 0 ? Number(retryAfterRaw) * 1000 : 0
      // 否则指数退避 1s→2s→4s…上限 30s，加随机抖动避免多个请求同时重试
      const attempt = Math.max(0, MAX_RETRY - retryAttempts)
      const backoff =
        retryAfterMs || Math.min(30_000, 1000 * 2 ** attempt) + Math.floor(Math.random() * 500)

      if (retryAttempts - 1 <= 0) {
        console.error(`[Notion] ❌ 429 限流，重试 ${MAX_RETRY} 次后仍失败 id="${id}"`)
        const cached = await getDataFromCache('page_block_' + id)
        return cached || null
      }
      console.warn(
        `[Notion] ⏳ 429 限流，${backoff}ms 后重试（剩余 ${retryAttempts - 1} 次）id="${id}"`
      )
      await delay(backoff)
      return getPageWithRetry(id, from, retryAttempts - 1)
    }

    // 其它错误：先看缓存，再重试
    const cacheKey = 'page_block_' + id
    const pageBlock = await getDataFromCache(cacheKey)
    if (pageBlock) {
      return pageBlock
    }

    return getPageWithRetry(id, from, retryAttempts - 1)
  }
}

/**
 * Notion页面BLOCK格式化处理
 * 1.删除冗余字段
 * 2.比如文件、视频、音频、url格式化
 * 3.代码块等元素兼容
 * @param {*} id 页面ID
 * @param {*} blockMap 页面元素
 * @param {*} slice 截取数量
 * @returns
 */
export function formatNotionBlock(block) {
  const clonedBlock = deepClone(block)
  const blocksToProcess = Object.keys(clonedBlock || {})

  for (let i = 0; i < blocksToProcess.length;) {
    const blockId = blocksToProcess[i]
    let b = clonedBlock[blockId]

    // ✅ 【新增】统一结构：兼容新版双层嵌套格式
    // 新格式: { spaceId, value: { value: { id, type }, role } }
    // 次格式: { value: { id, type }, role }
    // 旧格式: { value: { id, type } }
    if (b?.value?.value?.id) {
      // 新格式，剥掉外层，只保留真实 block value
      clonedBlock[blockId] = { value: b.value.value }
      b = clonedBlock[blockId]
    } else if (!b?.value?.id && b?.value?.role !== undefined) {
      // role:none 等无权限 block，直接跳过
      i++
      continue
    }

    // ✅ 【新增】清理 crdt 字段，react-notion-x 不认识会报 Unsupported block type
    if (b?.value) {
      delete b.value.crdt_data
      delete b.value.crdt_format_version
    }

    // 原有逻辑不变 ↓↓↓

    sanitizeBlockUrls(b?.value)

    if (b?.value?.type === 'sync_block' && b?.value?.children) {
      const childBlocks = b.value.children
      const childBlockIds = []
      delete clonedBlock[blockId]
      childBlocks.forEach((childBlock, index) => {
        const newBlockId = `${blockId}_child_${index}`
        clonedBlock[newBlockId] = childBlock
        childBlockIds.push(newBlockId)
      })
      blocksToProcess.splice(i, 1, ...childBlockIds)
      continue
    }

    if (b?.value?.type === 'code') {
      if (b?.value?.properties?.language?.[0][0] === 'C++') {
        b.value.properties.language[0][0] = 'cpp'
      }
      if (b?.value?.properties?.language?.[0][0] === 'C#') {
        b.value.properties.language[0][0] = 'csharp'
      }
      if (b?.value?.properties?.language?.[0][0] === 'Assembly') {
        b.value.properties.language[0][0] = 'asm6502'
      }
    }

    if (
      ['file', 'pdf', 'video', 'audio'].includes(b?.value?.type) &&
      b?.value?.properties?.source?.[0][0] &&
      (b?.value?.properties?.source?.[0][0]?.startsWith('attachment') ||
        b?.value?.properties?.source?.[0][0].indexOf('amazonaws.com') > 0)
    ) {
      const oldUrl = b?.value?.properties?.source?.[0][0]
      // 域名走配置：Notion 已从 notion.so 迁到 notion.com，
      // 这里原本硬编码 notion.so，改域名后附件/PDF/视频会全部失效
      const host = (BLOG.NOTION_HOST || 'https://www.notion.so').replace(/\/$/, '')
      const newUrl = `${host}/signed/${encodeURIComponent(oldUrl)}?table=block&id=${b?.value?.id}`
      b.value.properties.source[0][0] = newUrl
    }

    i++
  }

  return clonedBlock
}

/**
 * 根据[]ids，批量抓取blocks
 * 在获取数据库文章列表时，超过一定数量的block会被丢弃，因此根据pageId批量抓取block
 * @param {*} ids
 * @param {*} batchSize
 * @returns
 */
export const fetchInBatches = async (ids, batchSize = 30) => {
  if (!Array.isArray(ids)) {
    ids = [ids]
  }

  let fetchedBlocks = {}

  if(ids.length === 0) {
    return fetchedBlocks
  }
  
  console.log('[Batch] START total ids:', ids.length)

  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize)

    console.log(`\n[Batch] processing ${i} ~ ${i + batch.length}`)

    try {
      const result = await limit(async () => {
        // 👉 控制节奏（避免突发）
        await delay(REQUEST_INTERVAL)

        console.log('[API-->>批量请求]', batch.length)

        const start = Date.now()

        const pageChunk = await notionAPI.getBlocks(batch)

        const end = Date.now()

        const blocks = pageChunk?.recordMap?.block || {}

        console.log(
          `[API<<--批量响应] size:${batch.length} 耗时:${end - start}ms blocks:${Object.keys(blocks).length}`
        )

        return blocks
      })

      // ✅ 合并结果
      fetchedBlocks = {
        ...fetchedBlocks,
        ...result
      }

    } catch (err) {
      console.warn('[Batch API异常]', err.message)
    }
  }

  return fetchedBlocks
}

/**
 * 强制修复 block 中所有可能的非法 URL 字段
 * @param {Object} blockValue - block.value
 */
function sanitizeBlockUrls(blockValue) {
  if (!blockValue || typeof blockValue !== 'object') return

  const fixUrl = (url) => {
    if (typeof url !== 'string') return url

    if (url.startsWith('/')) {
      return url
    }

    // 修复 http:xxx → http://xxx
    if (url.startsWith('http:') && !url.startsWith('http://')) {
      url = 'http://' + url.slice(5)
    } else if (url.startsWith('https:') && !url.startsWith('https://')) {
      url = 'https://' + url.slice(6)
    }

    // 再次验证是否合法，否则替换为占位图
    try {
      new URL(url)
      return url
    } catch {
      console.warn('[Sanitize URL] Invalid URL replaced:', url)
      return 'https://via.placeholder.com/1x1?text=Invalid+Image'
    }
  }

  // 1. 处理 properties.source（用于 image, embed, bookmark, file, pdf 等）
  if (
    blockValue.properties?.source?.[0]?.[0] &&
    typeof blockValue.properties.source[0][0] === 'string'
  ) {
    blockValue.properties.source[0][0] = fixUrl(blockValue.properties.source[0][0])
  }

  // 2. 处理 file.url（用于 file block）
  if (blockValue.file?.url && typeof blockValue.file.url === 'string') {
    blockValue.file.url = fixUrl(blockValue.file.url)
  }

  // 3. 处理 format.page_cover（页面封面）
  if (blockValue.format?.page_cover && typeof blockValue.format.page_cover === 'string') {
    blockValue.format.page_cover = fixUrl(blockValue.format.page_cover)
  }

  // 4. 处理其他可能的 URL 字段（可选扩展）
  // 例如：video、audio 的 source 可能也走 properties.source，已覆盖
}