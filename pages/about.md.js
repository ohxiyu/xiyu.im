import { sendAgentText } from '@/lib/agentic/serve-text'

export const getServerSideProps = ctx => sendAgentText(ctx, 'about')

export default function MarkdownAbout() {
  return null
}
