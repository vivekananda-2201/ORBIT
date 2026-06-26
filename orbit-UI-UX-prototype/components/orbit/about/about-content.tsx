'use client'

import { useState } from 'react'
import {
  Star,
  Send,
  Mail,
  ArrowUpRight,
  GitPullRequest,
  Lightbulb,
  Bug,
  Cpu,
  Lock,
  Boxes,
  LineChart,
  Check,
} from 'lucide-react'
import { OrbitMark } from '../orbit-mark'

const PILLARS = [
  {
    icon: Lock,
    title: 'Local-first',
    body: 'Every token is generated on your machine through Ollama. Nothing leaves your device.',
  },
  {
    icon: Boxes,
    title: 'Model-agnostic',
    body: 'Swap, stack and compare any installed model without touching a config file.',
  },
  {
    icon: LineChart,
    title: 'Measured by default',
    body: 'Throughput, latency and quality are first-class — not an afterthought.',
  },
  {
    icon: Cpu,
    title: 'No code required',
    body: 'Run real experiments through a UI instead of writing throwaway scripts.',
  },
]

const POSTS = [
  {
    tag: 'Engineering',
    date: 'Apr 24, 2026',
    title: 'Why ORBIT measures eval duration per response',
    excerpt:
      'Token throughput alone hides the cold-start cost. Here is how ORBIT separates time-to-first-token from steady-state generation.',
    read: '6 min',
  },
  {
    tag: 'Research',
    date: 'Apr 11, 2026',
    title: 'Comparing 4 quantizations of Llama 3.1 8B',
    excerpt:
      'Q4_K_M vs Q5_K_M vs Q8_0 vs FP16 — a local benchmark of speed and answer quality across a fixed prompt set.',
    read: '9 min',
  },
  {
    tag: 'Product',
    date: 'Mar 30, 2026',
    title: 'Designing the Arena: 4 models, one prompt',
    excerpt:
      'The story behind side-by-side columns and the HUD that turns raw runs into a verdict you can act on.',
    read: '4 min',
  },
]

const CONTRIB = [
  { icon: Lightbulb, label: 'Feature request', desc: 'Suggest something ORBIT should do' },
  { icon: Bug, label: 'Bug report', desc: 'Tell me what broke' },
  { icon: GitPullRequest, label: 'Pull request', desc: 'Open a PR on the repo' },
]

export function AboutContent() {
  const [active, setActive] = useState(0)
  const [sent, setSent] = useState(false)

  return (
    <div className="h-full overflow-y-auto">
      {/* Hero */}
      <section className="orbit-grid relative border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-border bg-card orbit-glow">
            <OrbitMark className="size-10" />
          </div>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
            Operational Research &amp; Benchmarking Interface for Transformers
          </p>
          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            A local-first laboratory for AI experimentation
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-[15px] leading-relaxed text-muted-foreground">
            ORBIT is a personal project built to stop wasting time on glue code. Instead of
            writing custom scripts to test a model, you chat, compare, benchmark and analyze
            inside one unified workbench — all running on your own hardware.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
              <Star className="size-4" />
              Star on GitHub
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40">
              Read the docs
              <ArrowUpRight className="size-4" />
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-16 px-6 py-14">
        {/* Pillars */}
        <section>
          <SectionLabel>Philosophy</SectionLabel>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p) => (
              <div key={p.title} className="rounded-xl border border-border bg-card p-5">
                <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-secondary">
                  <p.icon className="size-4 text-primary" strokeWidth={1.75} />
                </div>
                <h3 className="mt-3 text-[15px] font-medium text-foreground">{p.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Blog */}
        <section>
          <div className="flex items-end justify-between">
            <SectionLabel>Lab notes</SectionLabel>
            <button className="flex items-center gap-1 text-[12px] text-muted-foreground transition-colors hover:text-foreground">
              All posts <ArrowUpRight className="size-3.5" />
            </button>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            {POSTS.map((post) => (
              <article
                key={post.title}
                className="group flex cursor-pointer flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
              >
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  <span className="text-primary">{post.tag}</span>
                  <span>·</span>
                  <span>{post.date}</span>
                </div>
                <h3 className="mt-3 text-[15px] font-medium leading-snug text-foreground">
                  {post.title}
                </h3>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-[12px] text-muted-foreground">
                  <span className="font-mono">{post.read} read</span>
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Contribute */}
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <SectionLabel>Contribute</SectionLabel>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
              Help shape ORBIT
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
              ORBIT is open and evolving. Pick a lane below or send a note directly — feature
              ideas, benchmarks you want built in, or rough edges you hit.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              {CONTRIB.map((c, i) => (
                <button
                  key={c.label}
                  onClick={() => setActive(i)}
                  className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-colors ${
                    active === i
                      ? 'border-primary/50 bg-accent'
                      : 'border-border bg-card hover:border-primary/30'
                  }`}
                >
                  <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-secondary">
                    <c.icon className="size-4 text-primary" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-foreground">{c.label}</p>
                    <p className="text-[12px] text-muted-foreground">{c.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-[15px] font-medium text-foreground">
              {CONTRIB[active].label}
            </h3>
            <p className="mt-1 text-[13px] text-muted-foreground">{CONTRIB[active].desc}</p>
            <div className="mt-5 flex flex-col gap-3">
              <Field label="Name">
                <input
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                  placeholder="Ada Lovelace"
                />
              </Field>
              <Field label="Email">
                <input
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                  placeholder="you@example.com"
                />
              </Field>
              <Field label="Message">
                <textarea
                  rows={4}
                  className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                  placeholder={`Describe your ${CONTRIB[active].label.toLowerCase()}…`}
                />
              </Field>
              <button
                onClick={() => {
                  setSent(true)
                  setTimeout(() => setSent(false), 2200)
                }}
                className="flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                {sent ? (
                  <>
                    <Check className="size-4" /> Sent
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Footer / creator */}
        <section className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-sm font-medium text-primary">
              VK
            </div>
            <div>
              <p className="text-[14px] font-medium text-foreground">Built by VK</p>
              <p className="text-[12px] text-muted-foreground">
                ORBIT · a local-first AI workbench
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Social icon={Send} />
            <Social icon={Mail} />
          </div>
        </section>
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
      {children}
    </p>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}

function Social({ icon: Icon }: { icon: typeof Star }) {
  return (
    <button className="flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">
      <Icon className="size-4" strokeWidth={1.75} />
    </button>
  )
}
