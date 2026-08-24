import { sendAgentText } from '@/lib/agentic/serve-text'

export const getServerSideProps = ctx => sendAgentText(ctx, 'developer')

export default function MarkdownDeveloper() {
  return null
}
