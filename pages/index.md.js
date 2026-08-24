import { sendAgentText } from '@/lib/agentic/serve-text'

export const getServerSideProps = ctx => sendAgentText(ctx, 'home')

export default function MarkdownHome() {
  return null
}
