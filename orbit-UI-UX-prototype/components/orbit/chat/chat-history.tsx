'use client'

import { useState } from 'react'
import { Plus, Search, Pin, MessageSquare, Trash2 } from 'lucide-react'
import { CHAT_HISTORY, MODELS } from '@/lib/orbit-data'
import { cn } from '@/lib/utils'

export function ChatHistory({
  activeId,
  onSelect,
  onNew,
}: {
  activeId: string
  onSelect: (id: string) => void
  onNew: () => void
}) {
  const [query, setQuery] = useState('')
  const [deleted, setDeleted] = useState<string[]>([])

  const chats = CHAT_HISTORY.filter(
    (c) => !deleted.includes(c.id) && c.title.toLowerCase().includes(query.toLowerCase()),
  )
  const pinned = chats.filter((c) => c.pinned)
  const recent = chats.filter((c) => !c.pinned)

  return (
    <div className="flex w-72 shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="p-3">
        <button
          onClick={onNew}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" strokeWidth={2} />
          New session
        </button>
        <div className="relative mt-3">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sessions"
            className="w-full rounded-lg border border-border bg-card py-1.5 pl-8 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        {pinned.length > 0 && (
          <Section label="Pinned">
            {pinned.map((c) => (
              <ChatRow
                key={c.id}
                chat={c}
                active={c.id === activeId}
                onSelect={() => onSelect(c.id)}
                onDelete={() => setDeleted((d) => [...d, c.id])}
              />
            ))}
          </Section>
        )}
        <Section label="Recent">
          {recent.map((c) => (
            <ChatRow
              key={c.id}
              chat={c}
              active={c.id === activeId}
              onSelect={() => onSelect(c.id)}
              onDelete={() => setDeleted((d) => [...d, c.id])}
            />
          ))}
          {recent.length === 0 && pinned.length === 0 && (
            <p className="px-2 py-6 text-center text-[12px] text-muted-foreground">
              No sessions found
            </p>
          )}
        </Section>
      </div>

      <div className="border-t border-border p-3">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Stored locally</span>
          <span className="font-mono">{chats.length} sessions</span>
        </div>
      </div>
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <p className="px-2 py-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  )
}

function ChatRow({
  chat,
  active,
  onSelect,
  onDelete,
}: {
  chat: (typeof CHAT_HISTORY)[number]
  active: boolean
  onSelect: () => void
  onDelete: () => void
}) {
  const model = MODELS.find((m) => m.id === chat.model)
  return (
    <div
      className={cn(
        'group relative flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 transition-colors',
        active ? 'bg-accent' : 'hover:bg-secondary',
      )}
      onClick={onSelect}
    >
      {chat.pinned ? (
        <Pin className="size-3.5 shrink-0 text-primary" />
      ) : (
        <MessageSquare className="size-3.5 shrink-0 text-muted-foreground" />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] text-foreground">{chat.title}</p>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
          <span
            className="size-1.5 rounded-full"
            style={{ backgroundColor: model?.accent }}
          />
          <span className="truncate">{chat.model}</span>
          <span>·</span>
          <span>{chat.updated}</span>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        className="shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
        aria-label="Delete session"
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  )
}
