'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  MessageSquareText,
  Swords,
  User,
  Settings,
  Cpu,
  HardDrive,
  Activity,
  Command,
  CircleDot,
} from 'lucide-react'
import { OrbitMark } from './orbit-mark'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/', label: 'Chat', icon: MessageSquareText },
  { href: '/arena', label: 'Arena', icon: Swords },
  { href: '/about', label: 'About', icon: User },
]

function RailLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string
  label: string
  icon: typeof MessageSquareText
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative flex h-12 w-12 flex-col items-center justify-center rounded-lg text-muted-foreground transition-colors',
        active
          ? 'bg-accent text-primary'
          : 'hover:bg-secondary hover:text-foreground',
      )}
      aria-current={active ? 'page' : undefined}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
      )}
      <Icon className="size-5" strokeWidth={1.75} />
      <span className="mt-0.5 text-[9px] font-medium tracking-wide">{label}</span>
    </Link>
  )
}

function StatusChip({
  icon: Icon,
  label,
  value,
  tone = 'default',
}: {
  icon: typeof Cpu
  label: string
  value: string
  tone?: 'default' | 'good'
}) {
  return (
    <div className="hidden items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1 md:flex">
      <Icon
        className={cn('size-3.5', tone === 'good' ? 'text-primary' : 'text-muted-foreground')}
        strokeWidth={1.75}
      />
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="font-mono text-[11px] text-foreground">{value}</span>
    </div>
  )
}

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Icon rail */}
      <aside className="flex w-16 shrink-0 flex-col items-center border-r border-border bg-sidebar py-3">
        <Link href="/" className="mb-4 flex size-10 items-center justify-center">
          <OrbitMark className="size-7" />
        </Link>
        <nav className="flex flex-1 flex-col items-center gap-1">
          {NAV.map((item) => (
            <RailLink
              key={item.href}
              {...item}
              active={
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href)
              }
            />
          ))}
        </nav>
        <div className="flex flex-col items-center gap-1">
          <button className="flex size-12 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <Settings className="size-5" strokeWidth={1.75} />
          </button>
          <div className="mt-1 flex size-9 items-center justify-center rounded-full border border-border bg-card text-xs font-medium text-primary">
            VK
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Status bar */}
        <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-sm font-semibold tracking-tight text-foreground">
                ORBIT
              </span>
              <span className="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground sm:inline">
                Lab
              </span>
            </div>
            <span className="text-border">/</span>
            <div className="min-w-0">
              <h1 className="truncate text-sm font-medium text-foreground">{title}</h1>
              {subtitle && (
                <p className="truncate text-[11px] text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <StatusChip icon={CircleDot} label="Ollama" value="connected" tone="good" />
            <StatusChip icon={Cpu} label="GPU" value="64°C" />
            <StatusChip icon={HardDrive} label="VRAM" value="9.2/16GB" />
            <StatusChip icon={Activity} label="avg" value="62 tok/s" tone="good" />
            <button className="flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">
              <Command className="size-3.5" strokeWidth={1.75} />
              <span className="font-mono">⌘K</span>
            </button>
            {actions}
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  )
}
