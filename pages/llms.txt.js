import { sendAgentText } from '@/lib/agentic/serve-text'

export const getServerSideProps = async ctx => sendAgentText(ctx, 'llms')

export default function LlmsText() {
  return null
}
