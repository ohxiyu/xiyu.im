import BLOG from '@/blog.config'
import AgentReadableLayout from '@/components/AgentReadableLayout'
import { siteConfig } from '@/lib/config'

const AgenticPage = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return (
    <AgentReadableLayout
      theme={theme}
      layoutName='LayoutInfoPage'
      {...props}
    />
  )
}

export default AgenticPage
