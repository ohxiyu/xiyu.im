import { bearerToken, clientIp, createRateLimiter, tokenMatches } from '@/lib/server/guard'
import { isPageInSite } from '@/lib/db/pageScope'

describe('tokenMatches', () => {
  it('没配 token 一律拒绝', () => {
    expect(tokenMatches('anything', '')).toBe(false)
    expect(tokenMatches('', '')).toBe(false)
  })
  it('只认完全相同的 token', () => {
    expect(tokenMatches('secret', 'secret')).toBe(true)
    expect(tokenMatches('secret ', 'secret')).toBe(false)
    expect(tokenMatches('secre', 'secret')).toBe(false)
  })
  it('从 Authorization 取 Bearer', () => {
    expect(bearerToken({ headers: { authorization: 'Bearer abc' } })).toBe('abc')
    expect(bearerToken({ headers: { authorization: 'Basic abc' } })).toBe('')
  })
})

describe('clientIp / createRateLimiter', () => {
  it('优先 x-real-ip', () => {
    expect(clientIp({ headers: { 'x-real-ip': '1.1.1.1', 'x-forwarded-for': '2.2.2.2' } })).toBe('1.1.1.1')
    expect(clientIp({ headers: { 'x-forwarded-for': '2.2.2.2, 3.3.3.3' } })).toBe('2.2.2.2')
  })
  it('窗口内超过 max 次才限流', () => {
    const limited = createRateLimiter({ windowMs: 60000, max: 2 })
    expect(limited('a')).toBe(false)
    expect(limited('a')).toBe(false)
    expect(limited('a')).toBe(true)
    expect(limited('b')).toBe(false)
  })
})

describe('isPageInSite', () => {
  const POST = '11111111-1111-1111-1111-111111111111'
  const CHILD = '22222222-2222-2222-2222-222222222222'
  const GRAND = '33333333-3333-3333-3333-333333333333'
  const allPages = [{ id: POST, status: 'Published' }, { id: 'draft', status: 'Draft' }]
  const page = (id, parent) => ({ value: { id, parent_id: parent } })

  it('文章的子页面、孙页面可以渲染', () => {
    const blocks = { [CHILD]: page(CHILD, POST), [GRAND]: page(GRAND, CHILD) }
    expect(isPageInSite({ id: CHILD, blockMap: { block: blocks } }, allPages)).toBe(true)
    expect(isPageInSite({ id: GRAND, blockMap: { block: blocks } }, allPages)).toBe(true)
  })
  it('站外页面、草稿下的页面不渲染', () => {
    const blocks = { [CHILD]: page(CHILD, 'some-private-workspace-page') }
    expect(isPageInSite({ id: CHILD, blockMap: { block: blocks } }, allPages)).toBe(false)
    const underDraft = { [CHILD]: page(CHILD, 'draft') }
    expect(isPageInSite({ id: CHILD, blockMap: { block: underDraft } }, allPages)).toBe(false)
  })
  it('32 位无横线 ID 也能匹配', () => {
    const blocks = { [CHILD]: page(CHILD, POST.replace(/-/g, '')) }
    expect(isPageInSite({ id: CHILD, blockMap: { block: blocks } }, allPages)).toBe(true)
  })
})
