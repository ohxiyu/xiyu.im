import { siteConfig } from '@/lib/config'

// 关于页 · "Elsewhere" 社交链接区
// 对应 .design/source/about.jsx 的 .elsewhere 段
const Elsewhere = () => {
  const twitter = siteConfig('CONTACT_TWITTER')
  const github = siteConfig('CONTACT_GITHUB')
  const email = siteConfig('CONTACT_EMAIL')
  const enableRss = siteConfig('ENABLE_RSS')
  const newsletter = siteConfig('CONTACT_NEWSLETTER')

  const rows = [
    twitter && {
      platform: 'Twitter',
      handle: twitter.match(/([^/]+)\/?$/)?.[1] ? `@${twitter.match(/([^/]+)\/?$/)[1]} →` : 'Twitter →',
      href: twitter,
      target: '_blank'
    },
    github && {
      platform: 'GitHub',
      handle: github.match(/([^/]+)\/?$/)?.[1] ? `@${github.match(/([^/]+)\/?$/)[1]} →` : 'GitHub →',
      href: github,
      target: '_blank'
    },
    email && { platform: 'Email', handle: `${email} →`, href: `mailto:${email}` },
    enableRss && { platform: 'RSS', handle: '/feed.xml →', href: '/feed' },
    newsletter && { platform: 'Newsletter', handle: `${newsletter} →`, href: newsletter, target: '_blank' }
  ].filter(Boolean)

  if (!rows.length) return null

  return (
    <section className='elsewhere'>
      <h2 className='elsewhere-title'>Elsewhere</h2>
      <div className='link-list'>
        {rows.map(r => (
          <a
            key={r.platform}
            className='link-row'
            href={r.href}
            target={r.target || undefined}
            rel={r.target === '_blank' ? 'noopener noreferrer' : undefined}>
            <span className='link-platform'>{r.platform}</span>
            <span className='link-handle'>{r.handle}</span>
          </a>
        ))}
      </div>
    </section>
  )
}

export default Elsewhere
