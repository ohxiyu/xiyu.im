export type NegotiatedMediaType = 'text/html' | 'text/markdown'

type MediaRange = {
  type: string
  subtype: string
  quality: number
  position: number
}

const SUPPORTED_MEDIA_TYPES: NegotiatedMediaType[] = [
  'text/html',
  'text/markdown'
]

const parseQuality = (parameters: string[]) => {
  const qualityParameter = parameters.find(parameter =>
    parameter.trim().toLowerCase().startsWith('q=')
  )
  if (!qualityParameter) return 1

  const quality = Number(qualityParameter.split('=')[1]?.trim())
  if (!Number.isFinite(quality) || quality < 0 || quality > 1) return 0
  return quality
}

const parseAccept = (acceptHeader: string): MediaRange[] =>
  acceptHeader
    .split(',')
    .map((entry, position) => {
      const [mediaType, ...parameters] = entry.split(';')
      const [type, subtype] = mediaType.trim().toLowerCase().split('/')
      if (!type || !subtype) return null

      return {
        type,
        subtype,
        quality: parseQuality(parameters),
        position
      }
    })
    .filter((entry): entry is MediaRange => Boolean(entry))

const matchSpecificity = (
  candidate: NegotiatedMediaType,
  range: MediaRange
) => {
  const [candidateType, candidateSubtype] = candidate.split('/')
  if (range.type === '*' && range.subtype === '*') return 0
  if (range.type === candidateType && range.subtype === '*') return 1
  if (
    range.type === candidateType &&
    range.subtype === candidateSubtype
  ) {
    return 2
  }
  return -1
}

const preferenceFor = (
  candidate: NegotiatedMediaType,
  ranges: MediaRange[]
) => {
  let specificity = -1
  let position = Number.POSITIVE_INFINITY
  let quality = 0

  for (const range of ranges) {
    const matchedSpecificity = matchSpecificity(candidate, range)
    if (matchedSpecificity < 0) continue

    if (
      matchedSpecificity > specificity ||
      (matchedSpecificity === specificity && range.position < position)
    ) {
      specificity = matchedSpecificity
      position = range.position
      quality = range.quality
    }
  }

  return { quality, position }
}

/**
 * Choose between the two representations this site actually produces.
 * Specific media ranges override wildcards. Across candidates, q-value wins;
 * equal q-values use client order. A wildcard-only tie stays on HTML so a
 * conventional `Accept: *\/*` request does not unexpectedly become Markdown.
 */
export const preferredMediaType = (
  acceptHeader: string | null | undefined
): NegotiatedMediaType | null => {
  if (!acceptHeader?.trim()) return 'text/html'

  const ranges = parseAccept(acceptHeader)
  if (!ranges.length) return null

  let bestType: NegotiatedMediaType | null = null
  let bestQuality = 0
  let bestPosition = Number.POSITIVE_INFINITY

  for (const candidate of SUPPORTED_MEDIA_TYPES) {
    const { quality, position } = preferenceFor(candidate, ranges)
    if (quality <= 0) continue

    if (
      quality > bestQuality ||
      (quality === bestQuality && position < bestPosition)
    ) {
      bestType = candidate
      bestQuality = quality
      bestPosition = position
    }
  }

  return bestType
}

export const appendNegotiationVary = (headers: Headers) => {
  const required = ['Accept', 'Accept-Encoding']
  const existing = (headers.get('Vary') || '')
    .split(',')
    .map(value => value.trim())
    .filter(Boolean)
  const lowerCaseExisting = new Set(existing.map(value => value.toLowerCase()))

  for (const value of required) {
    if (!lowerCaseExisting.has(value.toLowerCase())) {
      existing.push(value)
    }
  }

  headers.set('Vary', existing.join(', '))
}
