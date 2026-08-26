import { ImageResponse } from 'next/og'

export const config = {
  runtime: 'edge'
}

const clean = (value: string | null, fallback: string, maxLength: number): string => {
  const text = String(value || '').trim() || fallback
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text
}

const loadTitleFont = async (requestUrl: string): Promise<ArrayBuffer | null> => {
  try {
    const fontUrl = new URL('/fonts/noto-sans-sc-700-gb2312.ttf', requestUrl)
    const response = await fetch(fontUrl)
    if (!response.ok) return null
    return await response.arrayBuffer()
  } catch {
    return null
  }
}

export default async function handler(request: Request): Promise<ImageResponse> {
  const { searchParams } = new URL(request.url)
  const title = clean(searchParams.get('title'), '西羽的文章', 84)
  const category = clean(searchParams.get('category'), 'Writing', 28)
  const date = clean(searchParams.get('date'), 'xiyu.im', 20)
  const fontData = await loadTitleFont(request.url)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '68px 76px',
          color: '#17130d',
          background: '#f6f0e5',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'Noto Sans SC'
        }}>
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            width: '340px',
            height: '340px',
            right: '-72px',
            top: '-98px',
            borderRadius: '999px',
            background: '#f2b92b',
            opacity: 0.92
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', fontSize: '24px' }}>
          <div style={{ display: 'flex', width: '42px', height: '4px', background: '#e8a600' }} />
          <div style={{ display: 'flex', letterSpacing: '4px', textTransform: 'uppercase' }}>
            {category}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            maxWidth: '980px',
            fontSize: title.length > 42 ? '58px' : '70px',
            lineHeight: 1.18,
            fontWeight: 700,
            letterSpacing: '-2px'
          }}>
          {title}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            paddingTop: '26px',
            borderTop: '2px solid rgba(23, 19, 13, .16)',
            fontSize: '22px'
          }}>
          <div style={{ display: 'flex', fontWeight: 700, letterSpacing: '1px' }}>xiyu.im</div>
          <div style={{ display: 'flex', color: '#756c5f' }}>{date}</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400'
      },
      ...(fontData
        ? {
            fonts: [
              {
                name: 'Noto Sans SC',
                data: fontData,
                style: 'normal' as const,
                weight: 700 as const
              }
            ]
          }
        : {})
    }
  )
}
