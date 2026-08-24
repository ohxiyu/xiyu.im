import { sendAgentText } from '@/lib/agentic/serve-text'

export const getServerSideProps = ctx => sendAgentText(ctx, 'agentInstructions')

export default function AgentInstructionsText() {
  return null
}
