import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'

// xiyu 主题页脚
export const Footer = props => {
  const currentYear = new Date().getFullYear()
  const since = parseInt(siteConfig('SINCE')) || currentYear
  const dateRange = since < currentYear ? since + '—' + currentYear : String(currentYear)
  const author = siteConfig('AUTHOR') || 'xiyu'
  const link = siteConfig('LINK') || ''
  const host = link.replace(/^https?:\/\//, '').replace(/\/$/, '') || 'xiyu.im'
  const tagline = siteConfig('XIYU_FOOT_QUOTE', null, CONFIG) || siteConfig('BIO') || '长期主义 · 记录思考'
  // 技术栈一行字（原关于页 Colophon 区块压缩至此）
  const stack = siteConfig('XIYU_FOOT_STACK', 'Notion × NotionNext × Vercel', CONFIG)
  return (
    <footer className='site-foot'>
      <div className='site-foot-copy'>
        <span>© {author} {dateRange}</span>
        <span>{host} · {tagline}{stack ? ` · ${stack}` : ''}</span>
      </div>
      <nav className='site-foot-links' aria-label='站点说明与机器资源'>
        <SmartLink href='/contact'>联系</SmartLink>
        <SmartLink href='/privacy'>隐私</SmartLink>
        <SmartLink href='/developer'>开发者资源</SmartLink>
        <SmartLink href='/llms.txt'>llms.txt</SmartLink>
      </nav>
    </footer>
  )
}

export default Footer
