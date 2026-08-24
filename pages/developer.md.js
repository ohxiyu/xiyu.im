import { sendAgentText } from '@/lib/agentic/serve-text'

export const getServerSideProps = async ctx => sendAgentText(ctx, 'developer')

export default function MarkdownDeveloper() {
  return null
}
