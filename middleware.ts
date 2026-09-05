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
 * 本站是个人博客，没有登录体系，中间件只做两件事：
 * 1. 内容协商——Accept: text/markdown 时把 / /about 等页面重写到对应的 .md
 * 2. UUID 重定向——把 Notion 的 32 位 id 换成可读 slug
 */
export const config = {
  // 这里设置白名单，防止静态资源被拦截
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
}

export default async function middleware(req: NextRequest) {
  const negotiatedResponse = getContentNegotiationResponse(req)
  if (negotiatedResponse) return negotiatedResponse

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
        'redirect from %s to %s',
        req.nextUrl.pathname,
        redirectToUrl.pathname
      )
      return finalizeNegotiatedResponse(
        req,
        NextResponse.redirect(redirectToUrl, 308)
      )
    }
  }
  return finalizeNegotiatedResponse(req, NextResponse.next())
}
