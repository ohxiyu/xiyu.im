import { siteConfig } from '@/lib/config'
import Image from 'next/image'
import CONFIG from '../config'

// BIO 是两句话，拆开让第二句走 em（橙色斜体）——和首页大标题
// 「…… 把状态<em>从对话搬进仓库</em>」是同一个处理
function splitBio(bio) {
  const text = String(bio || '').trim()
  const idx = text.indexOf('。')
  if (idx <= 0 || idx >= text.length - 1) return [text, '']
  return [text.slice(0, idx + 1), text.slice(idx + 1)]
}

/**
 * 关于页头部。
 *
 * 用的就是首页 .hero 那个两栏骨架：左边 eyebrow + 大字 + 「在做」那一行，
 * 右边一个块（首页放 Now 卡，这里放头像）。
 *
 * 之前这里是一根单列，四层小元素往下堆（eyebrow → 头像+名字 → 在做 → 数字），
 * 全是小字，没有视觉落点——名字只有两个字符，撑不起一屏的头部。
 * 现在大字是那句自述，名字退进 eyebrow。
 */
const AboutHero = () => {
  const author = siteConfig('AUTHOR') || 'xiyu'
  const since = parseInt(siteConfig('SINCE')) || new Date().getFullYear()
  const doing = siteConfig('XIYU_ABOUT_DOING', [], CONFIG) || []
  const [first, rest] = splitBio(
    siteConfig('BIO') || '用 AI Agent 给自己造系统。写作是公开的思考存档。'
  )

  return (
    <header className='hero about-hero'>
      <div>
        <div className='eyebrow hero-eyebrow'>
          {author} · about · since {since}
        </div>
        <h1 className='hero-title about-hero-title'>
          <span>{first}</span>
          {rest && <em>{rest}</em>}
        </h1>
        {doing.length > 0 && (
          <div className='hero-status'>
            <p className='hero-status-line'>
              <span className='hero-status-label'>在做</span>
              <span className='hero-status-topics'>
                {doing.map((item, i) => (
                  <span key={item}>
                    {i > 0 && <span className='hero-status-dot'> · </span>}
                    {item}
                  </span>
                ))}
              </span>
            </p>
          </div>
        )}
      </div>
      <div className='about-avatar'>
        <Image
          src='/images/xiyu-avatar.png'
          alt={`${author} 的头像`}
          width={1254}
          height={1254}
          sizes='(max-width: 768px) 96px, 200px'
          className='about-avatar-img'
          priority
        />
      </div>
    </header>
  )
}

export default AboutHero
