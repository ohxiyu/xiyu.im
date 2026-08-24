import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { checkStrIsNotionId, getLastPartOfUrl } from '@/lib/utils'
import { idToUuid } from 'notion-utils'
import BLOG from './blog.config'
import {
  appendNegotiationVary,
  preferredMediaType
} from './lib/http/accept'

const markdownRepresentations: Record<string, string> = {
  '/': '/index.md',
  '/about': '/about.md',
  '/contact': '/contact.md',
  '/privacy': '/privacy.md',
  '/developer': '/developer.md'
}

const normalizeNegotiatedPath = (pathname: string) =>
  pathname === '/' ? pathname : pathname.replace(/\/$/, '')

const isNegotiatedPath = (req: NextRequest) =>
  Boolean(markdownRepresentations[normalizeNegotiatedPath(req.nextUrl.pathname)])

const finalizeNegotiatedResponse = (
  req: NextRequest,
  response: NextResponse
) => {
  if (isNegotiatedPath(req)) {
    appendNegotiationVary(response.headers)
  }
  return response
}

const getContentNegotiationResponse = (req: NextRequest) => {
  if (!['GET', 'HEAD'].includes(req.method)) return null

  const pathname = normalizeNegotiatedPath(req.nextUrl.pathname)
  const markdownPath = markdownRepresentations[pathname]
  if (!markdownPath) return null

  const preferred = preferredMediaType(req.headers.get('accept'))
  if (preferred === 'text/markdown') {
    const markdownUrl = req.nextUrl.clone()
    markdownUrl.pathname = markdownPath
    const response = NextResponse.rewrite(markdownUrl)
    appendNegotiationVary(response.headers)
    return response
  }

  if (preferred === null) {
    const response = new NextResponse(
      'Not Acceptable\n\nAvailable: text/html, text/markdown\n',
      {
        status: 406,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8'
        }
      }
    )
    appendNegotiationVary(response.headers)
    return response
  }

  return null
}

/**
 * Clerk 身份验证中间件
 */
export const config = {
  // 这里设置白名单，防止静态资源被拦截
  matcher: ['/((?!.*\\..*|_next|/sign-in|/auth).*)', '/', '/(api|trpc)(.*)']
}

// 限制登录访问的路由
const isTenantRoute = createRouteMatcher([
  '/user/organization-selector(.*)',
  '/user/orgid/(.*)',
  '/dashboard',
  '/dashboard/(.*)'
])

// 限制权限访问的路由
const isTenantAdminRoute = createRouteMatcher([
  '/admin/(.*)/memberships',
  '/admin/(.*)/domain'
])

/**
 * 没有配置权限相关功能的返回
 * @param req
 * @param ev
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
const noAuthMiddleware = async (req: NextRequest, ev: any) => {
  const negotiatedResponse = getContentNegotiationResponse(req)
  if (negotiatedResponse) return negotiatedResponse

  // 如果没有配置 Clerk 相关环境变量，返回一个默认响应或者继续处理请求
  if (BLOG['UUID_REDIRECT']) {
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
      return finalizeNegotiatedResponse(
        req,
        NextResponse.redirect(redirectToUrl, 308)
      )
    }
  }
  return finalizeNegotiatedResponse(req, NextResponse.next())
}
/**
 * 鉴权中间件
 */
const authMiddleware = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  ? clerkMiddleware((auth, req) => {
      const negotiatedResponse = getContentNegotiationResponse(req)
      if (negotiatedResponse) return negotiatedResponse

      const { userId } = auth()
      // 处理 /dashboard 路由的登录保护
      if (isTenantRoute(req)) {
        if (!userId) {
          // 用户未登录，重定向到 /sign-in
          const url = new URL('/sign-in', req.url)
          url.searchParams.set('redirectTo', req.url) // 保存重定向目标
          return finalizeNegotiatedResponse(req, NextResponse.redirect(url))
        }
      }

      // 处理管理员相关权限保护
      if (isTenantAdminRoute(req)) {
        auth().protect(has => {
          return (
            has({ permission: 'org:sys_memberships:manage' }) ||
            has({ permission: 'org:sys_domains_manage' })
          )
        })
      }

      // 默认继续处理请求
      return finalizeNegotiatedResponse(req, NextResponse.next())
    })
  : noAuthMiddleware

export default authMiddleware
