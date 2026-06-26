import { AppShell } from '@/components/orbit/app-shell'
import { ChatWorkspace } from '@/components/orbit/chat/chat-workspace'

export default function ChatPage() {
  return (
    <AppShell title="Chat" subtitle="Local inference workspace">
      <ChatWorkspace />
    </AppShell>
  )
}
