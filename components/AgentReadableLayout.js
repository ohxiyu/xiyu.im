import { getDirectXiyuLayoutName } from '@/lib/agentic/layout'
import { DynamicLayout } from '@/themes/theme'
import {
  Layout404 as Xiyu404,
  LayoutInfoPage as XiyuInfoPage,
  LayoutSlug as XiyuSlug
} from '@/themes/xiyu'

const AgentReadableLayout = props => {
  const directLayout = getDirectXiyuLayoutName(props)

  if (directLayout === 'LayoutInfoPage') {
    return <XiyuInfoPage {...props} />
  }
  if (directLayout === 'Layout404') {
    return <Xiyu404 {...props} />
  }
  if (directLayout === 'LayoutSlug') {
    return <XiyuSlug {...props} />
  }
  return <DynamicLayout {...props} />
}

export default AgentReadableLayout
