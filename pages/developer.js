import AgenticPage from '@/components/AgenticPage'
import { getAgenticPageStaticProps } from '@/lib/agentic/page-props'

export const getStaticProps = async ({ locale }) =>
  getAgenticPageStaticProps({ pageKey: 'developer', locale })

export default AgenticPage
