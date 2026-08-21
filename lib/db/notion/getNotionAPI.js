import { NotionAPI as NotionLibrary } from 'notion-client'
import BLOG from '@/blog.config'
import path from 'path'
import { RateLimiter } from './RateLimiter'

// 限流配置，打包编译阶段避免接口频繁，限制频率
const useRateLimiter = process.env.BUILD_MODE || process.env.EXPORT
const lockFilePath = path.resolve(process.cwd(), '.notion-api-lock')
const rateLimiter = new RateLimiter(50, lockFilePath)

const globalStore = { notion: null, inflight: new Map() }

/**
 * 打印一次鉴权配置状态
 *
 * 排查 403 时最大的盲点是「环境变量到底有没有被读到」——日志里只看得见
 * 请求失败，看不出是没配、配错了位置，还是配了但 Notion 仍然拒绝。
 * 这里只输出布尔值与长度，**绝不打印 token 本身**（它等同于账号凭证，
 * 而构建日志往往是可分享的）。
 */
function logAuthStatus() {
  const token = BLOG.NOTION_TOKEN_V2
  const activeUser = BLOG.NOTION_ACTIVE_USER
  console.log(
    '[Notion] 鉴权配置 — NOTION_TOKEN_V2: %s / NOTION_ACTIVE_USER: %s / API: %s',
    token ? `已配置(${String(token).length} 字符)` : '未配置',
    activeUser ? '已配置' : '未配置',
    BLOG.API_BASE_URL || 'https://www.notion.so/api/v3'
  )
  if (!token) {
    console.log(
      '[Notion] 提示：未配置 NOTION_TOKEN_V2。若构建报 403，' +
        '请在部署平台的环境变量里添加它（浏览器 Cookie 中的 token_v2）。'
    )
  }
}

function getRawNotion() {
  if (!globalStore.notion) {
    logAuthStatus()
    globalStore.notion = new NotionLibrary({
      apiBaseUrl: BLOG.API_BASE_URL || 'https://www.notion.so/api/v3',
      activeUser: BLOG.NOTION_ACTIVE_USER || null,
      authToken: BLOG.NOTION_TOKEN_V2 || null,
      userTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      kyOptions: {
        mode: 'cors',
        hooks: {
          beforeRequest: [
            (request) => {
              const url = request.url.toString()
              if (url.includes('/api/v3/syncRecordValues')) {
                return new Request(
                  url.replace('/api/v3/syncRecordValues', '/api/v3/syncRecordValuesMain'),
                  request
                )
              }
              return request
            }
          ]
        }
      }
    })
  }
  return globalStore.notion
}

async function callNotion(methodName, ...args) {
  const notion = getRawNotion()
  const original = notion[methodName]
  if (typeof original !== 'function') throw new Error(`${methodName} is not a function`)

  const key = `${methodName}-${JSON.stringify(args)}`

  if (globalStore.inflight.has(key)) return globalStore.inflight.get(key)

  const execute = async () => original.apply(notion, args)
  const promise = useRateLimiter
    ? rateLimiter.enqueue(key, execute)
    : execute()

  globalStore.inflight.set(key, promise)
  promise.finally(() => globalStore.inflight.delete(key))
  return promise
}

export const notionAPI = {
  getPage: (...args) => callNotion('getPage', ...args),
  getBlocks: (...args) => callNotion('getBlocks', ...args),
  getUsers: (...args) => callNotion('getUsers', ...args),
  __call: callNotion
}

export default notionAPI
