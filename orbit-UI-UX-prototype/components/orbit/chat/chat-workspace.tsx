'use client'

import { useState, useRef, useEffect } from 'react'
import {
  ArrowUp,
  Gauge,
  Timer,
  Hash,
  Copy,
  RefreshCw,
  Sliders,
  Sparkles,
} from 'lucide-react'
import {
  SAMPLE_CONVERSATION,
  PROMPT_SUGGESTIONS,
  MODELS,
  type ChatMessage,
} from '@/lib/orbit-data'
import { ChatHistory } from './chat-history'
import { ModelPicker } from './model-picker'
import { ParamPanel } from './param-panel'
import { MessageContent } from './message-content'
import { OrbitMark } from '../orbit-mark'
import { cn } from '@/lib/utils'

const CANNED_REPLY =
  "Great question. At a high level you'd start by isolating the variables you want to compare, hold everything else constant, then measure throughput and quality across runs.\n\n```python\nresults = [run(model, prompt) for model in models]\nbest = max(results, key=lambda r: r.quality / r.latency)\n```\n\nThat ratio gives you a quick **quality-per-millisecond** signal you can rank models by."

export function ChatWorkspace() {
  const [model, setModel] = useState(MODELS[0].id)
  const [activeChat, setActiveChat] = useState('c1')
  const [messages, setMessages] = useState<ChatMessage[]>(SAMPLE_CONVERSATION)
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [showParams, setShowParams] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, streaming])

  function send(text: string) {
    const content = text.trim()
    if (!content || streaming) return
    setMessages((m) => [...m, { role: 'user', content }])
    setInput('')
    setStreaming(true)

    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: CANNED_REPLY,
          metrics: {
            tokensPerSec: Math.round((55 + Math.random() * 35) * 10) / 10,
            evalDurationMs: Math.round(600 + Math.random() * 1600),
            promptTokens: Math.round(20 + Math.random() * 160),
            evalTokens: Math.round(60 + Math.random() * 90),
          },
        },
      ])
      setStreaming(false)
    }, 1400)
  }

  function newChat() {
    setMessages([])
    setActiveChat('new')
  }

  return (
    <div className="flex h-full">
      <ChatHistory activeId={activeChat} onSelect={setActiveChat} onNew={newChat} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Sub-toolbar */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-2.5">
          <ModelPicker value={model} onChange={setModel} />
          <span className="hidden font-mono text-[11px] text-muted-foreground lg:inline">
            session · local · streaming
          </span>
          <button
            onClick={() => setShowParams((s) => !s)}
            className={cn(
              'ml-auto flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-[12px] transition-colors',
              showParams
                ? 'bg-accent text-primary'
                : 'bg-card text-muted-foreground hover:text-foreground',
            )}
          >
            <Sliders className="size-3.5" strokeWidth={1.75} />
            Config
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <EmptyState onPick={(t) => setInput(t)} />
          ) : (
            <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-6">
              {messages.map((m, i) => (
                <MessageRow key={i} message={m} />
              ))}
              {streaming && <StreamingRow />}
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="border-t border-border px-4 py-3">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-end gap-2 rounded-2xl border border-border bg-card p-2 focus-within:border-primary/40">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    send(input)
                  }
                }}
                rows={1}
                placeholder="Message the model…  (Enter to send, Shift+Enter for newline)"
                className="max-h-40 min-h-9 flex-1 resize-none bg-transparent px-2 py-1.5 text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || streaming}
                className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
                aria-label="Send"
              >
                <ArrowUp className="size-4" strokeWidth={2.25} />
              </button>
            </div>
            <p className="mt-1.5 text-center font-mono text-[10px] text-muted-foreground">
              Responses are generated locally · ORBIT does not send your data anywhere
            </p>
          </div>
        </div>
      </div>

      {showParams && <ParamPanel modelId={model} />}
    </div>
  )
}

function EmptyState({ onPick }: { onPick: (t: string) => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4 text-center">
      <OrbitMark className="size-12 opacity-90" />
      <h2 className="mt-5 text-xl font-semibold text-foreground">Start a local session</h2>
      <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
        Chat with any installed model. Every response is annotated with throughput and
        evaluation metrics so you can feel the difference.
      </p>
      <div className="mt-6 grid w-full max-w-lg grid-cols-1 gap-2 sm:grid-cols-2">
        {PROMPT_SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onPick(s)}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-left text-[13px] text-foreground transition-colors hover:border-primary/40"
          >
            <Sparkles className="size-3.5 shrink-0 text-primary" />
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}

function MessageRow({ message }: { message: ChatMessage }) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-tr-sm border border-border bg-secondary px-4 py-2.5 text-[14px] leading-relaxed text-foreground">
          {message.content}
        </div>
      </div>
    )
  }
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg border border-border bg-card">
        <OrbitMark className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <MessageContent content={message.content} />
        {message.metrics && <MetricsBar metrics={message.metrics} />}
      </div>
    </div>
  )
}

function MetricsBar({ metrics }: { metrics: NonNullable<ChatMessage['metrics']> }) {
  return (
    <div className="mt-2.5 flex flex-wrap items-center gap-3 border-t border-border/60 pt-2.5">
      <Metric icon={Gauge} value={`${metrics.tokensPerSec} tok/s`} hint="throughput" />
      <Metric
        icon={Timer}
        value={`${(metrics.evalDurationMs / 1000).toFixed(2)}s`}
        hint="eval duration"
      />
      <Metric
        icon={Hash}
        value={`${metrics.promptTokens} + ${metrics.evalTokens}`}
        hint="prompt + eval tokens"
      />
      <div className="ml-auto flex items-center gap-1">
        <IconBtn icon={Copy} label="Copy" />
        <IconBtn icon={RefreshCw} label="Regenerate" />
      </div>
    </div>
  )
}

function Metric({
  icon: Icon,
  value,
  hint,
}: {
  icon: typeof Gauge
  value: string
  hint: string
}) {
  return (
    <div className="flex items-center gap-1.5" title={hint}>
      <Icon className="size-3.5 text-primary" strokeWidth={1.75} />
      <span className="font-mono text-[11px] text-foreground">{value}</span>
    </div>
  )
}

function IconBtn({ icon: Icon, label }: { icon: typeof Copy; label: string }) {
  return (
    <button
      className="flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      aria-label={label}
    >
      <Icon className="size-3.5" strokeWidth={1.75} />
    </button>
  )
}

function StreamingRow() {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg border border-border bg-card">
        <OrbitMark className="size-4" />
      </div>
      <div className="flex items-center gap-2 pt-1">
        <span className="size-2 rounded-full bg-primary orbit-blink" />
        <span className="font-mono text-[12px] text-muted-foreground">generating…</span>
      </div>
    </div>
  )
}
