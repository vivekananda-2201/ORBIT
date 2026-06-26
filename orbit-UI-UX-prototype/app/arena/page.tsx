import { AppShell } from '@/components/orbit/app-shell'
import { ArenaWorkspace } from '@/components/orbit/arena/arena-workspace'

export default function ArenaPage() {
  return (
    <AppShell title="Model Arena" subtitle="Benchmark · compare · analyze">
      <ArenaWorkspace />
    </AppShell>
  )
}
