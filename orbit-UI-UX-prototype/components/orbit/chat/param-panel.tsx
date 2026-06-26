'use client'

import { useState } from 'react'
import { MODELS } from '@/lib/orbit-data'
import { Thermometer, Hash, Layers, Sparkles } from 'lucide-react'

function Slider({
  icon: Icon,
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  icon: typeof Thermometer
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  format?: (v: number) => string
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
          <Icon className="size-3.5" strokeWidth={1.75} />
          {label}
        </div>
        <span className="font-mono text-[12px] text-foreground">
          {format ? format(value) : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
      />
    </div>
  )
}

export function ParamPanel({ modelId }: { modelId: string }) {
  const model = MODELS.find((m) => m.id === modelId) ?? MODELS[0]
  const [temp, setTemp] = useState(0.7)
  const [topP, setTopP] = useState(0.9)
  const [maxTokens, setMaxTokens] = useState(2048)
  const [ctx, setCtx] = useState(8192)

  return (
    <div className="flex w-72 shrink-0 flex-col border-l border-border bg-sidebar">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Inference config
        </h2>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="mb-4 rounded-lg border border-border bg-card p-3">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full" style={{ backgroundColor: model.accent }} />
            <span className="text-sm font-medium text-foreground">{model.name}</span>
          </div>
          <dl className="mt-2.5 grid grid-cols-2 gap-y-1.5 font-mono text-[11px]">
            <dt className="text-muted-foreground">Params</dt>
            <dd className="text-right text-foreground">{model.params}</dd>
            <dt className="text-muted-foreground">Quant</dt>
            <dd className="text-right text-foreground">{model.quant}</dd>
            <dt className="text-muted-foreground">Context</dt>
            <dd className="text-right text-foreground">{model.context}</dd>
            <dt className="text-muted-foreground">Size</dt>
            <dd className="text-right text-foreground">{model.sizeGb} GB</dd>
          </dl>
        </div>

        <div className="flex flex-col gap-4">
          <Slider
            icon={Thermometer}
            label="Temperature"
            value={temp}
            min={0}
            max={2}
            step={0.1}
            onChange={setTemp}
            format={(v) => v.toFixed(1)}
          />
          <Slider
            icon={Sparkles}
            label="Top P"
            value={topP}
            min={0}
            max={1}
            step={0.05}
            onChange={setTopP}
            format={(v) => v.toFixed(2)}
          />
          <Slider
            icon={Hash}
            label="Max tokens"
            value={maxTokens}
            min={256}
            max={8192}
            step={256}
            onChange={setMaxTokens}
          />
          <Slider
            icon={Layers}
            label="Context window"
            value={ctx}
            min={2048}
            max={32768}
            step={2048}
            onChange={setCtx}
          />
        </div>

        <div className="mt-5">
          <label className="mb-1.5 block text-[12px] text-muted-foreground">System prompt</label>
          <textarea
            defaultValue="You are ORBIT, a precise local research assistant. Be concise and technically accurate."
            rows={4}
            className="w-full resize-none rounded-lg border border-border bg-card p-2.5 text-[12px] leading-relaxed text-foreground focus:border-primary/50 focus:outline-none"
          />
        </div>
      </div>

      <div className="border-t border-border p-3">
        <button className="w-full rounded-lg border border-border bg-card py-2 text-[12px] font-medium text-foreground transition-colors hover:border-primary/40">
          Save as preset
        </button>
      </div>
    </div>
  )
}
