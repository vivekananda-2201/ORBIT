'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Box } from 'lucide-react'
import { MODELS, type OrbitModel } from '@/lib/orbit-data'
import { cn } from '@/lib/utils'

export function ModelPicker({
  value,
  onChange,
}: {
  value: string
  onChange: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = MODELS.find((m) => m.id === value) ?? MODELS[0]

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-left transition-colors hover:border-primary/40"
      >
        <span
          className="size-2 rounded-full"
          style={{ backgroundColor: selected.accent }}
        />
        <span className="text-sm font-medium text-foreground">{selected.name}</span>
        <span className="font-mono text-[11px] text-muted-foreground">{selected.params}</span>
        <ChevronDown className="size-4 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-2 w-80 overflow-hidden rounded-xl border border-border bg-popover shadow-2xl">
          <div className="border-b border-border px-3 py-2">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Installed models
            </p>
          </div>
          <div className="max-h-80 overflow-y-auto p-1.5">
            {MODELS.map((m) => (
              <ModelRow
                key={m.id}
                model={m}
                active={m.id === value}
                onSelect={() => {
                  if (m.status !== 'pulling') {
                    onChange(m.id)
                    setOpen(false)
                  }
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ModelRow({
  model,
  active,
  onSelect,
}: {
  model: OrbitModel
  active: boolean
  onSelect: () => void
}) {
  const pulling = model.status === 'pulling'
  return (
    <button
      onClick={onSelect}
      disabled={pulling}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors',
        active ? 'bg-accent' : 'hover:bg-secondary',
        pulling && 'cursor-not-allowed opacity-50',
      )}
    >
      <div
        className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border"
        style={{ backgroundColor: `color-mix(in oklch, ${model.accent} 14%, transparent)` }}
      >
        <Box className="size-4" style={{ color: model.accent }} strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-foreground">{model.name}</span>
          <span className="font-mono text-[10px] text-muted-foreground">{model.params}</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
          <span>{model.family}</span>
          <span>·</span>
          <span>{model.quant}</span>
          <span>·</span>
          <span>{model.sizeGb} GB</span>
        </div>
      </div>
      {pulling ? (
        <span className="font-mono text-[10px] text-primary orbit-pulse">pulling…</span>
      ) : active ? (
        <Check className="size-4 text-primary" />
      ) : (
        <span className="font-mono text-[10px] text-muted-foreground">{model.context}</span>
      )}
    </button>
  )
}
