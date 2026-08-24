import { sendAgentText } from '@/lib/agentic/serve-text'

export const getServerSideProps = ctx => sendAgentText(ctx, 'llmsFull')

export default function LlmsFullText() {
  return null
}
