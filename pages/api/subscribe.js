import subscribeToMailchimpApi from '@/lib/plugins/mailchimp'
import { clientIp, createRateLimiter } from '@/lib/server/guard'

const enabled = Boolean(process.env.MAILCHIMP_LIST_ID && process.env.MAILCHIMP_API_KEY)
const isRateLimited = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 5 })
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/
const clip = (value, max) => String(value || '').trim().slice(0, max)

/**
 * 接受邮件订阅。没配 Mailchimp 时当作不存在；同一 IP 10 分钟最多 5 次。
 * @param {*} req
 * @param {*} res
 */
export default async function handler(req, res) {
  if (!enabled) {
    return res.status(404).json({ status: 'error', message: 'Not found' })
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' })
  }
  if (isRateLimited(clientIp(req))) {
    return res.status(429).json({ status: 'error', message: 'Too many requests' })
  }
  const email = clip(req.body?.email, 254)
  if (!EMAIL.test(email)) {
    return res.status(400).json({ status: 'error', message: 'Invalid email' })
  }
  try {
    const response = await subscribeToMailchimpApi({
      email,
      first_name: clip(req.body?.firstName, 80),
      last_name: clip(req.body?.lastName, 80)
    })
    await response.json()
    res.status(200).json({ status: 'success', message: 'Subscription successful!' })
  } catch (error) {
    console.error('Subscription error:', error)
    res.status(400).json({ status: 'error', message: 'Subscription failed!' })
  }
}
