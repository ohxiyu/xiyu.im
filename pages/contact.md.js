import { sendAgentText } from '@/lib/agentic/serve-text'

export const getServerSideProps = ctx => sendAgentText(ctx, 'contact')

export default function MarkdownContact() {
  return null
}
