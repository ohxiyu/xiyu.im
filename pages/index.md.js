import { sendAgentText } from '@/lib/agentic/serve-text'

export const getServerSideProps = async ctx => sendAgentText(ctx, 'home')

export default function MarkdownHome() {
  return null
}
