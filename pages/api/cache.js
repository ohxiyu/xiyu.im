import { cleanCache } from '@/lib/cache/local_file_cache'
import { bearerToken, tokenMatches } from '@/lib/server/guard'

/**
 * 清理缓存
 * @param {*} req
 * @param {*} res
 */
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' })
  }

  // 没配 token 就整个关掉：以前没配时任何人都能清缓存
  const token = process.env.CACHE_REVALIDATION_TOKEN || process.env.REVALIDATION_TOKEN
  if (!token) {
    return res.status(404).json({ status: 'error', message: 'Not found' })
  }
  if (!tokenMatches(bearerToken(req), token)) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized' })
  }

  try {
    cleanCache()
    res.status(200).json({ status: 'success', message: 'Clean cache successful!' })
  } catch (error) {
    console.error('Cache clean error:', error)
    res.status(400).json({ status: 'error', message: 'Clean cache failed!' })
  }
}
