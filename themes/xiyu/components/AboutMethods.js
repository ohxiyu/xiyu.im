import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * 拆问题的三个框架。
 *
 * 原文里这三个概念挤在一句话里（「秩分析找最少的独立变量，第一性原理拆到
 * 不可再拆，人性透镜看激励从哪来」）——那是一个列表伪装成句子，拆成三张卡更好读。
 */
const ICONS = {
  rank: (
    <>
      <path d='M3 3h7v7H3zM14 14h7v7h-7z' />
      <path d='M10 6.5h4a2 2 0 0 1 2 2V14' />
    </>
  ),
  first: (
    <>
      <path d='M12 3v18M3 12h18' />
      <circle cx='12' cy='12' r='9' />
    </>
  ),
  lens: (
    <>
      <path d='M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z' />
      <circle cx='12' cy='12' r='2.5' />
    </>
  )
}

const AboutMethods = ({ note }) => {
  const methods = siteConfig('XIYU_ABOUT_METHODS', [], CONFIG) || []
  if (!methods.length) return null

  return (
    <section aria-labelledby='about-methods-title'>
      <div className='about-sec-label' id='about-methods-title'>
        拆问题的方法
      </div>
      <div className='about-methods'>
        {methods.map(method => (
          <Card key={method.name}>
            <CardContent>
              <div className='about-method-icon' aria-hidden='true'>
                <svg
                  width='15'
                  height='15'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'>
                  {ICONS[method.icon] || ICONS.rank}
                </svg>
              </div>
              <CardTitle className='about-method-name'>{method.name}</CardTitle>
              <CardDescription>{method.desc}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
      {note && <p className='about-methods-note'>{note}</p>}
    </section>
  )
}

export default AboutMethods
