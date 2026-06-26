'use client'

import { useState, useRef, useEffect } from 'react'
import { Plus, X, Play, Gauge, Timer, Hash, ChevronDown } from 'lucide-react'
import {
  MODELS,
  ARENA_RESPONSES,
  BENCH_RESULTS,
  BENCH_PROMPT,
} from '@/lib/orbit-data'
import { MessageContent } from '../chat/message-content'
import { cn } from '@/lib/utils'

type RunState = 'idle' | 'running' | 'done'

export function ArenaBenchmark({ onComplete }: { onComplete: () => void }) {
  const [slots, setSlots] = useState<string[]>(['llama3.1:8b', 'mistral:7b'])
  const [prompt, setPrompt] = useState(BENCH_PROMPT)
  const [run, setRun] = useState<RunState>('idle')
  const [revealed, setRevealed] = useState<string[]>([])
  const [addOpen, setAddOpen] = useState(false)

  function addSlot(id: string) {
    if (slots.length < 4 && !slots.includes(id)) setSlots((s) => [...s, id])
    setAddOpen(false)
  }
  function removeSlot(id: string) {
    setSlots((s) => s.filter((x) => x !== id))
    setRevealed((r) => r.filter((x) => x !== id))
  }

  function start() {
    if (run === 'running' || slots.length === 0) return
    setRun('running')
    setRevealed([])
    slots.forEach((id, i) => {
      setTimeout(() => {
        setRevealed((r) => [...r, id])
        if (i === slots.length - 1) setRun('done')
      }, 700 + i * 650)
    })
  }

  const available = MODELS.filter((m) => !slots.includes(m.id) && m.status !== 'pulling')
  const cols =
    slots.length <= 1
      ? 'grid-cols-1'
      : slots.length === 2
        ? 'grid-cols-1 md:grid-cols-2'
        : slots.length === 3
          ? 'grid-cols-1 md:grid-cols-3'
          : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4'

  return (
    <div className="flex h-full flex-col">
      {/* slot bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Models
        </span>
        {slots.map((id) => {
          const m = MODELS.find((x) => x.id === id)!
          return (
            <span
              key={id}
              className="flex items-center gap-2 rounded-lg border border-border bg-card py-1.5 pl-2.5 pr-1.5 text-[13px]"
            >
              <span className="size-2 rounded-full" style={{ backgroundColor: m.accent }} />
              <span className="text-foreground">{m.name}</span>
              <span className="font-mono text-[10px] text-muted-foreground">{m.params}</span>
              <button
                onClick={() => removeSlot(id)}
                className="rounded p-0.5 text-muted-foreground hover:text-destructive"
                aria-label={`Remove ${m.name}`}
              >
                <X className="size-3.5" />
              </button>
            </span>
          )
        })}

        {slots.length < 4 && (
          <div className="relative">
            <button
              onClick={() => setAddOpen((o) => !o)}
              className="flex items-center gap-1.5 rounded-lg border border-dashed border-border px-2.5 py-1.5 text-[13px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              <Plus className="size-3.5" />
              Add model
              <ChevronDown className="size-3.5" />
            </button>
            {addOpen && (
              <div className="absolute left-0 top-full z-30 mt-2 w-64 overflow-hidden rounded-xl border border-border bg-popover shadow-2xl">
                <div className="max-h-72 overflow-y-auto p-1.5">
                  {available.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => addSlot(m.id)}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-secondary"
                    >
                      <span className="size-2 rounded-full" style={{ backgroundColor: m.accent }} />
                      <span className="text-[13px] text-foreground">{m.name}</span>
                      <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                        {m.params}
                      </span>
                    </button>
                  ))}
                  {available.length === 0 && (
                    <p className="px-2 py-3 text-center text-[12px] text-muted-foreground">
                      All models added
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <span className="ml-auto font-mono text-[11px] text-muted-foreground">
          {slots.length}/4 slots
        </span>
      </div>

      {/* columns */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {slots.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
            Add models to start a comparison.
          </div>
        ) : (
          <div className={cn('grid h-full gap-4', cols)}>
            {slots.map((id) => (
              <BenchColumn
                key={id}
                modelId={id}
                run={run}
                revealed={revealed.includes(id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* shared composer */}
      <div className="border-t border-border px-4 py-3">
        <div className="flex items-end gap-2 rounded-2xl border border-border bg-card p-2 focus-within:border-primary/40">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={1}
            placeholder="Shared prompt sent to every model…"
            className="max-h-32 min-h-9 flex-1 resize-none bg-transparent px-2 py-1.5 text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {run === 'done' ? (
            <button
              onClick={onComplete}
              className="flex h-9 items-center gap-2 rounded-xl border border-primary/40 bg-accent px-4 text-[13px] font-medium text-primary"
            >
              View results
            </button>
          ) : (
            <button
              onClick={start}
              disabled={run === 'running' || slots.length === 0}
              className="flex h-9 items-center gap-2 rounded-xl bg-primary px-4 text-[13px] font-medium text-primary-foreground transition-opacity disabled:opacity-40"
            >
              <Play className="size-4" strokeWidth={2.25} />
              {run === 'running' ? 'Running…' : `Run on ${slots.length}`}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function BenchColumn({
  modelId,
  run,
  revealed,
}: {
  modelId: string
  run: RunState
  revealed: boolean
}) {
  const model = MODELS.find((m) => m.id === modelId)!
  const result = BENCH_RESULTS.find((r) => r.modelId === modelId)
  const response = ARENA_RESPONSES[modelId]
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (revealed) scrollRef.current?.scrollTo({ top: 0 })
  }, [revealed])

  const streaming = run === 'running' && !revealed

  return (
    <div className="flex min-h-80 flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div
        className="flex items-center gap-2 border-b border-border px-3 py-2.5"
        style={{ boxShadow: `inset 0 2px 0 0 color-mix(in oklch, ${model.accent} 60%, transparent)` }}
      >
        <span className="size-2 rounded-full" style={{ backgroundColor: model.accent }} />
        <span className="text-[13px] font-medium text-foreground">{model.name}</span>
        <span className="font-mono text-[10px] text-muted-foreground">{model.params}</span>
        <span className="ml-auto font-mono text-[10px] text-muted-foreground">{model.quant}</span>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto p-3">
        {run === 'idle' && (
          <p className="py-8 text-center text-[12px] text-muted-foreground">
            Waiting for run…
          </p>
        )}
        {streaming && (
          <div className="flex items-center gap-2 py-8 text-[12px] text-muted-foreground">
            <span className="size-2 rounded-full orbit-blink" style={{ backgroundColor: model.accent }} />
            generating…
          </div>
        )}
        {revealed && <MessageContent content={response} />}
      </div>

      {revealed && result && (
        <div className="flex flex-wrap items-center gap-3 border-t border-border px-3 py-2">
          <Stat icon={Gauge} value={`${result.tokensPerSec} t/s`} accent={model.accent} />
          <Stat icon={Timer} value={`${(result.totalMs / 1000).toFixed(2)}s`} accent={model.accent} />
          <Stat icon={Hash} value={`${result.totalTokens}`} accent={model.accent} />
        </div>
      )}
    </div>
  )
}

function Stat({
  icon: Icon,
  value,
  accent,
}: {
  icon: typeof Gauge
  value: string
  accent: string
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="size-3.5" style={{ color: accent }} strokeWidth={1.75} />
      <span className="font-mono text-[11px] text-foreground">{value}</span>
    </div>
  )
}
