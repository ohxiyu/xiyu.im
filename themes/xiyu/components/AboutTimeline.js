import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * 关于页时间轴。
 *
 * 结构（年份 + 小标题）来自 themes/xiyu/config.js 的 XIYU_ABOUT_TIMELINE，
 * 正文按顺序取 Notion about 页的前 N 个段落——所以 **Notion 里段落的顺序有意义**：
 * 第 1/2/3 段分别对应三个时期。段落不够时回退到配置里的 fallback。
 *
 * 这么拆是为了让你仍然能在 Notion 里改正文，而不必动代码；
 * 年份与小标题不常变，放代码里更稳。
 */
const AboutTimeline = ({ paragraphs = [] }) => {
  const eras = siteConfig('XIYU_ABOUT_TIMELINE', [], CONFIG) || []
  if (!eras.length) return null

  return (
    <section aria-labelledby='about-timeline-title'>
      <div className='about-sec-label'>Timeline</div>
      <Card>
        <CardHeader>
          <CardTitle as='h2' id='about-timeline-title'>
            从交易到造系统
          </CardTitle>
          <CardDescription>三个阶段，写作重心随之改变。</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className='about-timeline'>
            {eras.map((era, index) => (
              <li className='about-era' key={era.when}>
                <div className='about-era-head'>
                  <span className='about-era-when'>{era.when}</span>
                  <h3 className='about-era-title'>{era.title}</h3>
                </div>
                <p className='about-era-text'>
                  {paragraphs[index] || era.fallback}
                </p>
              </li>
            ))}
          </ol>
        </CardContent>
        <CardFooter>
          {(siteConfig('XIYU_ABOUT_TOPICS', [], CONFIG) || []).map(topic => (
            <Badge variant='outline' key={topic}>
              {topic}
            </Badge>
          ))}
          <SmartLink href='/archive' className='about-footer-link'>
            看全部文章 →
          </SmartLink>
        </CardFooter>
      </Card>
    </section>
  )
}

export default AboutTimeline
