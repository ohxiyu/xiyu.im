import SmartLink from '@/components/SmartLink'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * 关于页底部的联系入口。
 *
 * 旧版是一整张大卡片里放一个链接，过度构建。现在是一张卡带三个按钮：
 * X、RSS、归档。
 */
const Elsewhere = () => {
  const x = siteConfig('CONTACT_TWITTER') || siteConfig('XIYU_NAV_TWITTER', '', CONFIG)
  const handle = x?.match(/([^/]+)\/?$/)?.[1]

  return (
    <section aria-labelledby='about-elsewhere-title'>
      <div className='about-sec-label'>Elsewhere</div>
      <Card>
        <CardHeader>
          <CardTitle as='h2' id='about-elsewhere-title'>
            想聊点具体的
          </CardTitle>
          <CardDescription>
            纠错、引用确认、或者关于 Agent 与自托管的具体问题，都欢迎。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='about-links'>
            {x && (
              <a
                href={x}
                target='_blank'
                rel='noopener noreferrer'
                className={buttonVariants({ variant: 'primary' })}>
                  <svg width='13' height='13' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
                    <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
                  </svg>
                {handle ? `@${handle}` : 'X'}
              </a>
            )}
            <a href='/feed.xml' className={buttonVariants()}>
                <svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' aria-hidden='true'>
                  <path d='M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16' />
                  <circle cx='5' cy='19' r='1.5' fill='currentColor' stroke='none' />
                </svg>
              RSS
            </a>
            <SmartLink href='/archive' className={buttonVariants()}>
                <svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' aria-hidden='true'>
                  <path d='M4 7h16v13H4zM3 4h18v3H3z' />
                </svg>
              归档
            </SmartLink>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

export default Elsewhere
