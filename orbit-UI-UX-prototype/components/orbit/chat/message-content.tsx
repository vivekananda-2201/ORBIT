'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

// Minimal markdown rendering for the prototype: fenced code blocks,
// inline code, and **bold**. Not a full parser — just enough to feel real.

function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={`${keyPrefix}-${i}`} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={`${keyPrefix}-${i}`}
          className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[0.85em] text-primary"
        >
          {part.slice(1, -1)}
        </code>
      )
    }
    return <span key={`${keyPrefix}-${i}`}>{part}</span>
  })
}

function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="my-3 overflow-hidden rounded-lg border border-border bg-[oklch(0.1_0.006_250)]">
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {lang || 'code'}
        </span>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(code)
            setCopied(true)
            setTimeout(() => setCopied(false), 1200)
          }}
          className="flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 text-[12.5px] leading-relaxed">
        <code className="font-mono text-foreground/90">{code}</code>
      </pre>
    </div>
  )
}

export function MessageContent({ content }: { content: string }) {
  const segments = content.split(/```/)
  return (
    <div className="text-[14px] leading-relaxed text-foreground/90">
      {segments.map((seg, i) => {
        if (i % 2 === 1) {
          const firstLine = seg.indexOf('\n')
          const lang = firstLine > -1 ? seg.slice(0, firstLine).trim() : ''
          const code = firstLine > -1 ? seg.slice(firstLine + 1) : seg
          return <CodeBlock key={i} code={code.replace(/\n$/, '')} lang={lang} />
        }
        return seg.split('\n\n').map((para, j) =>
          para.trim() ? (
            <p key={`${i}-${j}`} className="mb-2 last:mb-0">
              {renderInline(para, `${i}-${j}`)}
            </p>
          ) : null,
        )
      })}
    </div>
  )
}
