import { sendAgentText } from '@/lib/agentic/serve-text'

export const getServerSideProps = async ctx => sendAgentText(ctx, 'about')

export default function MarkdownAbout() {
  return null
}
