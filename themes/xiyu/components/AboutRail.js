import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import TOC from './TOC'

// 目录项的 id 必须和正文里渲染出来的 id 对上——TOC 的滚动高亮是拿
// document.getElementById 去找的。两边都用这个函数，别各写各的。
export const eraAnchor = index => `about-era-${index}`

/**
 * 关于页左轨。
 *
 * 三段，和文章页左轨同一套排版（.toc-label / .side-label 是同一条 CSS 规则）：
 *
 *   Contents   —— 真目录，直接复用文章页的 <TOC>，滚动高亮的行为完全一致
 *   This site  —— 站点数字，原来是页面中间一条 .hero-meta，占一整块
 *   Elsewhere  —— 联系方式，原来是页面最底下一个独立区块
 *
 * 后两段挪进轨里之后，页面上的 rule-head 从三条减到两条。
 */
const AboutRail = ({ eras = [], postCount, tagCount }) => {
  const since = parseInt(siteConfig('SINCE')) || new Date().getFullYear()
  const years = Math.max(1, new Date().getFullYear() - since + 1)
  const x = siteConfig('CONTACT_TWITTER') || siteConfig('XIYU_NAV_TWITTER', '', CONFIG)
  const handle = x?.match(/([^/]+)\/?$/)?.[1]

  // 喂给 <TOC> 的合成目录。形状和 Notion 的 post.toc 一致：{ id, text, indentLevel }
  const toc = [
    { id: 'about-intro', text: '自述', indentLevel: 0 },
    ...eras.map((era, i) => ({
      id: eraAnchor(i),
      text: `${era.when}　${era.title}`,
      indentLevel: 0
    })),
    { id: 'about-boundaries', text: '这个博客是什么', indentLevel: 0 }
  ]

  return (
    <>
      <TOC toc={toc} />
      <aside className='article-side'>
        <section className='side-section'>
          <div className='side-label'>This site</div>
          <dl className='side-stats'>
            <div className='side-stat'>
              <dt>文章</dt>
              <dd>{postCount ?? '—'}</dd>
            </div>
            <div className='side-stat'>
              <dt>写作</dt>
              <dd>{years} y</dd>
            </div>
            <div className='side-stat'>
              <dt>主题</dt>
              <dd>{tagCount ?? '—'}</dd>
            </div>
          </dl>
        </section>
        <section className='side-section'>
          <div className='side-label'>Elsewhere</div>
          <div className='side-actions'>
            {x && (
              <a
                href={x}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-link'>
                {handle ? `@${handle}` : 'X'}
              </a>
            )}
            <a href='/feed.xml' className='inline-link'>RSS</a>
            <SmartLink href='/archive' className='inline-link'>归档</SmartLink>
          </div>
        </section>
      </aside>
    </>
  )
}

export default AboutRail
