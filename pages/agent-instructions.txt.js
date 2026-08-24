import { sendAgentText } from '@/lib/agentic/serve-text'

export const getServerSideProps = async ctx =>
  sendAgentText(ctx, 'agentInstructions')

export default function AgentInstructionsText() {
  return null
}
