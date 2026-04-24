import { siteConfig } from '@/lib/config'
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
  return (
    <footer className='site-foot'>
      <span>© {author} {dateRange}</span>
      <span>{host} · {tagline}</span>
    </footer>
  )
}

export default Footer
