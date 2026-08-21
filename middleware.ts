import { NextRequest, NextResponse } from 'next/server'
import { checkStrIsNotionId, getLastPartOfUrl } from '@/lib/utils'
import { idToUuid } from 'notion-utils'
import BLOG from './blog.config'

/**
 * 中间件：仅处理 UUID → slug 的重定向。
 *
 * 上游版本在这里挂了 Clerk 鉴权（登录、组织、管理员权限路由）。本站是
 * 纯博客，没有任何登录入口，Clerk 的 publishable key 也从未配置过——
 * 但 @clerk/nextjs 被静态 import，即使功能关闭也会被打进产物。
 * 随本次精简一并移除。
 */
export const config = {
  // 白名单：静态资源与 _next 不进中间件
  matcher: ['/((?!.*\\..*|_next).*)', '/']
}

export default async function middleware(req: NextRequest) {
  if (!BLOG.UUID_REDIRECT) {
    return NextResponse.next()
  }

  let redirectJson: Record<string, string> = {}
  try {
    const response = await fetch(`${req.nextUrl.origin}/redirect.json`)
    if (response.ok) {
      redirectJson = (await response.json()) as Record<string, string>
    }
  } catch (err) {
    console.error('Error fetching static file:', err)
  }

  let lastPart = getLastPartOfUrl(req.nextUrl.pathname) as string
  if (checkStrIsNotionId(lastPart)) {
    lastPart = idToUuid(lastPart)
  }
  if (lastPart && redirectJson[lastPart]) {
    const redirectToUrl = req.nextUrl.clone()
    redirectToUrl.pathname = '/' + redirectJson[lastPart]
    console.log(
      `redirect from ${req.nextUrl.pathname} to ${redirectToUrl.pathname}`
    )
    return NextResponse.redirect(redirectToUrl, 308)
  }

  return NextResponse.next()
}
