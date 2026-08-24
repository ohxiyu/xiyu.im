import { agentTextResources } from './content'

export const sendAgentText = (ctx, resourceKey) => {
  const resource = agentTextResources[resourceKey]
  if (!resource) {
    ctx.res.statusCode = 404
    ctx.res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    ctx.res.end('Not Found\n')
    return { props: {} }
  }

  ctx.res.statusCode = 200
  ctx.res.setHeader(
    'Content-Type',
    `${resource.contentType}; charset=utf-8`
  )
  ctx.res.setHeader('Vary', 'Accept, Accept-Encoding')
  ctx.res.setHeader(
    'Cache-Control',
    'public, s-maxage=300, stale-while-revalidate=86400'
  )
  ctx.res.end(resource.body)
  return { props: {} }
}
