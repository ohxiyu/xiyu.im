import { sendAgentText } from '@/lib/agentic/serve-text'

export const getServerSideProps = async ctx => sendAgentText(ctx, 'llmsFull')

export default function LlmsFullText() {
  return null
}
