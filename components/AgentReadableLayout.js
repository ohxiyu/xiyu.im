import { getDirectXiyuLayoutName } from '@/lib/agentic/layout'
import { DynamicLayout } from '@/themes/theme'
import {
  LayoutInfoPage as XiyuInfoPage,
  LayoutSlug as XiyuSlug
} from '@/themes/xiyu'

const AgentReadableLayout = props => {
  const directLayout = getDirectXiyuLayoutName(props)

  if (directLayout === 'LayoutInfoPage') {
    return <XiyuInfoPage {...props} />
  }
  if (directLayout === 'LayoutSlug') {
    return <XiyuSlug {...props} />
  }
  return <DynamicLayout {...props} />
}

export default AgentReadableLayout
