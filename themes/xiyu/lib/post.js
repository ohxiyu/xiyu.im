const INVALID_IMAGE_VALUES = new Set(['', 'undefined', 'null'])

export function getPostCover(post) {
  const candidates = [
    post?.pageCoverThumbnail,
    post?.pageCover,
    post?.pageProperties?.pageCoverThumbnail,
    post?.pageProperties?.pageCover
  ]

  for (const candidate of candidates) {
    if (typeof candidate !== 'string') continue
    const value = candidate.trim()
    if (!INVALID_IMAGE_VALUES.has(value.toLowerCase())) return value
  }

  return ''
}

export function getPostReadingTime(post) {
  const configured = Number(
    post?.readTime ?? post?.ext?.readTime ?? post?.pageProperties?.readTime
  )
  if (Number.isFinite(configured) && configured > 0) {
    return Math.max(1, Math.round(configured))
  }

  const words = Number(post?.wordCount)
  if (Number.isFinite(words) && words > 0) {
    return Math.max(1, Math.ceil(words / 400))
  }

  return null
}

export function getPostCategories(post) {
  const value = post?.category
  if (Array.isArray(value))
    return value
      .map(String)
      .map(item => item.trim())
      .filter(Boolean)
  if (typeof value === 'string' && value.trim()) return [value.trim()]
  return []
}

export function getPostYear(post) {
  return String(post?.publishDay || post?.date?.start_date || '').slice(0, 4)
}

export function getPostPublishTime(post) {
  const value = String(
    post?.publishDay || post?.date?.start_date || ''
  ).trim()
  const dateParts = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)

  if (dateParts) {
    const [, year, month, day] = dateParts
    return Date.UTC(Number(year), Number(month) - 1, Number(day))
  }

  const parsed = Date.parse(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function sortPostsByPublishDate(posts) {
  if (!Array.isArray(posts)) return []

  return [...posts].sort((a, b) => {
    const dateDifference = getPostPublishTime(b) - getPostPublishTime(a)
    if (dateDifference) return dateDifference

    const aKey = String(a?.id || a?.slug || a?.title || '')
    const bKey = String(b?.id || b?.slug || b?.title || '')
    return aKey.localeCompare(bKey)
  })
}

export function matchesPost(
  post,
  { tokens = [], category = '', year = '' } = {}
) {
  if (!post) return false
  if (category && !getPostCategories(post).includes(category)) return false
  if (year && getPostYear(post) !== year) return false

  if (!tokens.length) return true
  const tags = Array.isArray(post.tags) ? post.tags.join(' ') : post.tags || ''
  const categories = getPostCategories(post).join(' ')
  const haystack =
    `${post.title || ''} ${post.summary || ''} ${tags} ${categories}`.toLowerCase()
  return tokens.every(token => haystack.includes(token))
}
