/**
 * 极简 JWT（HMAC-SHA256），只用 Node 内置 crypto，零依赖
 * 仅服务端使用
 */
import crypto from 'crypto'

const b64u = input =>
  Buffer.from(input).toString('base64url')

const getSecret = () => {
  const s = process.env.PAYWALL_JWT_SECRET
  if (!s || s.length < 16) {
    throw new Error('PAYWALL_JWT_SECRET 未配置或过短（至少 16 字符）')
  }
  return s
}

/**
 * 签发解锁凭证
 * @param {object} payload 例如 { slug, txHash, chain }
 * @param {number|null} expiresInSec null = 永久
 */
export function signToken(payload, expiresInSec = null) {
  const secret = getSecret()
  const header = { alg: 'HS256', typ: 'JWT' }
  const body = { ...payload, iat: Math.floor(Date.now() / 1000) }
  if (expiresInSec) body.exp = body.iat + expiresInSec

  const head = b64u(JSON.stringify(header))
  const data = b64u(JSON.stringify(body))
  const sig = crypto
    .createHmac('sha256', secret)
    .update(`${head}.${data}`)
    .digest('base64url')
  return `${head}.${data}.${sig}`
}

/**
 * 校验凭证，通过返回 payload，否则返回 null
 */
export function verifyToken(token) {
  try {
    if (typeof token !== 'string') return null
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const [head, data, sig] = parts

    const expected = crypto
      .createHmac('sha256', getSecret())
      .update(`${head}.${data}`)
      .digest('base64url')

    // 定长比较，避免时序侧信道
    const a = Buffer.from(sig)
    const b = Buffer.from(expected)
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null

    const payload = JSON.parse(Buffer.from(data, 'base64url').toString())
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch (e) {
    return null
  }
}
