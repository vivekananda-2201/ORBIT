'use client'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  BarChart,
  Bar,
  Cell,
} from 'recharts'
import {
  Gauge,
  Timer,
  Zap,
  Trophy,
  TrendingUp,
  Award,
  ArrowDownUp,
} from 'lucide-react'
import {
  BENCH_RESULTS,
  THROUGHPUT_SERIES,
  QUALITY_RADAR,
  MODELS,
} from '@/lib/orbit-data'

const ACTIVE = ['llama3.1:8b', 'mistral:7b', 'qwen2.5:14b', 'phi3:3.8b']

function modelMeta(id: string) {
  return MODELS.find((m) => m.id === id)
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-xl">
      {label && <p className="mb-1 font-mono text-[10px] text-muted-foreground">{label}</p>}
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-[11px]">
          <span className="size-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-muted-foreground">{p.name ?? p.dataKey}</span>
          <span className="ml-auto font-mono text-foreground">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

function Panel({
  title,
  icon: Icon,
  children,
  className = '',
}: {
  title: string
  icon: typeof Gauge
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-xl border border-border bg-card p-4 ${className}`}>
      <div className="mb-3 flex items-center gap-2">
        <Icon className="size-4 text-primary" strokeWidth={1.75} />
        <h3 className="text-[13px] font-medium text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  )
}

const VERDICT_LABEL: Record<string, string> = {
  fastest: 'Fastest',
  balanced: 'Balanced',
  'highest-quality': 'Highest quality',
  'most-efficient': 'Most efficient',
}

export function ResultsDashboard() {
  const fastest = [...BENCH_RESULTS].sort((a, b) => b.tokensPerSec - a.tokensPerSec)[0]
  const best = [...BENCH_RESULTS].sort((a, b) => b.quality - a.quality)[0]
  const lowestLatency = [...BENCH_RESULTS].sort((a, b) => a.ttftMs - b.ttftMs)[0]
  const ranked = [...BENCH_RESULTS].sort((a, b) => b.quality / b.totalMs - a.quality / a.totalMs)

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-6xl space-y-4 p-5">
        {/* Run summary */}
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-primary" />
            <span className="text-sm font-medium text-foreground">Benchmark #0427</span>
          </div>
          <span className="font-mono text-[11px] text-muted-foreground">
            4 models · 1 prompt · 5 trials · completed 2m ago
          </span>
          <div className="ml-auto flex gap-2">
            <button className="rounded-lg border border-border bg-secondary px-3 py-1.5 text-[12px] text-foreground transition-colors hover:border-primary/40">
              Export JSON
            </button>
            <button className="rounded-lg bg-primary px-3 py-1.5 text-[12px] font-medium text-primary-foreground">
              Re-run
            </button>
          </div>
        </div>

        {/* Verdict cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <VerdictCard
            icon={Zap}
            label="Fastest"
            model={fastest.name}
            value={`${fastest.tokensPerSec} tok/s`}
            accent={fastest.accent}
          />
          <VerdictCard
            icon={Trophy}
            label="Highest quality"
            model={best.name}
            value={`${best.quality}/100`}
            accent={best.accent}
          />
          <VerdictCard
            icon={Timer}
            label="Lowest latency"
            model={lowestLatency.name}
            value={`${lowestLatency.ttftMs}ms TTFT`}
            accent={lowestLatency.accent}
          />
          <VerdictCard
            icon={Award}
            label="Best value"
            model={ranked[0].name}
            value="quality / ms"
            accent={ranked[0].accent}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Throughput line */}
          <Panel title="Throughput over generation" icon={TrendingUp} className="lg:col-span-2">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={THROUGHPUT_SERIES} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="t"
                    stroke="var(--muted-foreground)"
                    tick={{ fontSize: 10, fontFamily: 'var(--font-mono)' }}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="var(--muted-foreground)"
                    tick={{ fontSize: 10, fontFamily: 'var(--font-mono)' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  {ACTIVE.map((id) => (
                    <Line
                      key={id}
                      type="monotone"
                      dataKey={id}
                      name={modelMeta(id)?.name}
                      stroke={modelMeta(id)?.accent}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 3 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <Legend />
          </Panel>

          {/* Quality radar */}
          <Panel title="Quality profile" icon={Award}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={QUALITY_RADAR} outerRadius="72%">
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis
                    dataKey="metric"
                    tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }}
                  />
                  {ACTIVE.map((id) => (
                    <Radar
                      key={id}
                      dataKey={id}
                      name={modelMeta(id)?.name}
                      stroke={modelMeta(id)?.accent}
                      fill={modelMeta(id)?.accent}
                      fillOpacity={0.08}
                      strokeWidth={1.5}
                    />
                  ))}
                  <Tooltip content={<ChartTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Tokens/sec bar */}
          <Panel title="Average throughput" icon={Gauge}>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={BENCH_RESULTS}
                  layout="vertical"
                  margin={{ top: 0, right: 16, left: 8, bottom: 0 }}
                >
                  <CartesianGrid stroke="var(--border)" horizontal={false} />
                  <XAxis
                    type="number"
                    stroke="var(--muted-foreground)"
                    tick={{ fontSize: 10, fontFamily: 'var(--font-mono)' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="var(--muted-foreground)"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    width={84}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--secondary)' }} />
                  <Bar dataKey="tokensPerSec" name="tok/s" radius={[0, 4, 4, 0]}>
                    {BENCH_RESULTS.map((r) => (
                      <Cell key={r.modelId} fill={r.accent} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          {/* Latency bar */}
          <Panel title="Time to first token" icon={Timer}>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={BENCH_RESULTS}
                  layout="vertical"
                  margin={{ top: 0, right: 16, left: 8, bottom: 0 }}
                >
                  <CartesianGrid stroke="var(--border)" horizontal={false} />
                  <XAxis
                    type="number"
                    stroke="var(--muted-foreground)"
                    tick={{ fontSize: 10, fontFamily: 'var(--font-mono)' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="var(--muted-foreground)"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    width={84}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--secondary)' }} />
                  <Bar dataKey="ttftMs" name="ms" radius={[0, 4, 4, 0]} fillOpacity={0.55}>
                    {BENCH_RESULTS.map((r) => (
                      <Cell key={r.modelId} fill={r.accent} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        {/* Leaderboard table */}
        <Panel title="Leaderboard" icon={ArrowDownUp}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="py-2 pr-4 font-medium">#</th>
                  <th className="py-2 pr-4 font-medium">Model</th>
                  <th className="py-2 pr-4 text-right font-medium">Throughput</th>
                  <th className="py-2 pr-4 text-right font-medium">TTFT</th>
                  <th className="py-2 pr-4 text-right font-medium">Total</th>
                  <th className="py-2 pr-4 text-right font-medium">Tokens</th>
                  <th className="py-2 pr-4 text-right font-medium">Quality</th>
                  <th className="py-2 text-right font-medium">Verdict</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {ranked.map((r, i) => (
                  <tr key={r.modelId} className="border-b border-border/50 last:border-0">
                    <td className="py-2.5 pr-4 text-muted-foreground">{i + 1}</td>
                    <td className="py-2.5 pr-4">
                      <div className="flex items-center gap-2 font-sans">
                        <span className="size-2 rounded-full" style={{ backgroundColor: r.accent }} />
                        <span className="text-foreground">{r.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 pr-4 text-right text-foreground">{r.tokensPerSec} t/s</td>
                    <td className="py-2.5 pr-4 text-right text-muted-foreground">{r.ttftMs}ms</td>
                    <td className="py-2.5 pr-4 text-right text-muted-foreground">
                      {(r.totalMs / 1000).toFixed(2)}s
                    </td>
                    <td className="py-2.5 pr-4 text-right text-muted-foreground">{r.totalTokens}</td>
                    <td className="py-2.5 pr-4 text-right text-foreground">{r.quality}</td>
                    <td className="py-2.5 text-right">
                      <span
                        className="inline-block rounded-full border px-2 py-0.5 font-sans text-[10px]"
                        style={{
                          borderColor: `color-mix(in oklch, ${r.accent} 40%, transparent)`,
                          color: r.accent,
                        }}
                      >
                        {VERDICT_LABEL[r.verdict]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  )
}

function VerdictCard({
  icon: Icon,
  label,
  model,
  value,
  accent,
}: {
  icon: typeof Gauge
  label: string
  model: string
  value: string
  accent: string
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-4">
      <div
        className="absolute -right-6 -top-6 size-20 rounded-full opacity-20 blur-2xl"
        style={{ backgroundColor: accent }}
      />
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
        <Icon className="size-3.5" style={{ color: accent }} strokeWidth={1.75} />
        {label}
      </div>
      <p className="mt-2 text-lg font-semibold text-foreground">{model}</p>
      <p className="font-mono text-[12px]" style={{ color: accent }}>
        {value}
      </p>
    </div>
  )
}

function Legend() {
  return (
    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
      {ACTIVE.map((id) => (
        <div key={id} className="flex items-center gap-1.5">
          <span
            className="h-0.5 w-3 rounded-full"
            style={{ backgroundColor: modelMeta(id)?.accent }}
          />
          <span className="text-[11px] text-muted-foreground">{modelMeta(id)?.name}</span>
        </div>
      ))}
    </div>
  )
}
