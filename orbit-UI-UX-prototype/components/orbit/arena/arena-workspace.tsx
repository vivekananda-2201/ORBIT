'use client'

import { useState } from 'react'
import { Swords, LayoutDashboard } from 'lucide-react'
import { ArenaBenchmark } from './arena-benchmark'
import { ResultsDashboard } from './results-dashboard'
import { cn } from '@/lib/utils'

type Tab = 'benchmark' | 'results'

export function ArenaWorkspace() {
  const [tab, setTab] = useState<Tab>('benchmark')

  return (
    <div className="flex h-full flex-col">
      {/* Tab switcher */}
      <div className="flex items-center gap-1 border-b border-border px-4 py-2">
        <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
          <TabButton
            active={tab === 'benchmark'}
            onClick={() => setTab('benchmark')}
            icon={Swords}
            label="Benchmark"
          />
          <TabButton
            active={tab === 'results'}
            onClick={() => setTab('results')}
            icon={LayoutDashboard}
            label="Analysis"
          />
        </div>
        <p className="ml-3 hidden font-mono text-[11px] text-muted-foreground lg:block">
          {tab === 'benchmark'
            ? 'Run one prompt across up to 4 models side by side'
            : 'Aggregated metrics, charts, and verdicts from the last run'}
        </p>
      </div>

      <div className="min-h-0 flex-1">
        {tab === 'benchmark' ? (
          <ArenaBenchmark onComplete={() => setTab('results')} />
        ) : (
          <ResultsDashboard />
        )}
      </div>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: typeof Swords
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors',
        active
          ? 'bg-accent text-primary'
          : 'text-muted-foreground hover:text-foreground',
      )}
    >
      <Icon className="size-4" strokeWidth={1.75} />
      {label}
    </button>
  )
}
