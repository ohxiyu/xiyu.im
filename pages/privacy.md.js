import { sendAgentText } from '@/lib/agentic/serve-text'

export const getServerSideProps = ctx => sendAgentText(ctx, 'privacy')

export default function MarkdownPrivacy() {
  return null
}
