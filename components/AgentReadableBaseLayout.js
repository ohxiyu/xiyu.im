import { getDirectXiyuLayoutName } from '@/lib/agentic/layout'
import { getBaseLayoutByTheme } from '@/themes/theme'
import { LayoutBase as XiyuBase } from '@/themes/xiyu'

const AgentReadableBaseLayout = props => {
  if (
    getDirectXiyuLayoutName({
      theme: props.theme,
      layoutName: 'LayoutBase'
    })
  ) {
    return <XiyuBase {...props} />
  }

  const Layout = getBaseLayoutByTheme(props.theme)
  return <Layout {...props} />
}

export default AgentReadableBaseLayout
