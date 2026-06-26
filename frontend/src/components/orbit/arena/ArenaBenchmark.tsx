import { useState, useRef, useEffect } from 'react';
import { Plus, X, Play, Gauge, Timer, Hash, ChevronDown } from 'lucide-react';
import { MODELS, ARENA_RESPONSES, BENCH_RESULTS, BENCH_PROMPT } from '../../../utils/orbit-data';
import styles from './ArenaBenchmark.module.css';

type RunState = 'idle' | 'running' | 'done';

function renderSimpleMarkdown(content: string) {
  const segments = content.split(/```/);
  return segments.map((seg, i) => {
    if (i % 2 === 1) {
      const firstLine = seg.indexOf('\n');
      const code = firstLine > -1 ? seg.slice(firstLine + 1) : seg;
      return (
        <div key={i} className={styles.codeBlock}>
          <pre className={styles.codePre}>
            <code>{code.replace(/\n$/, '')}</code>
          </pre>
        </div>
      );
    }
    return seg.split('\n\n').map((para, j) =>
      para.trim() ? (
        <p
          key={`${i}-${j}`}
          dangerouslySetInnerHTML={{
            __html: para
              .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
              .replace(/`([^`]+)`/g, '<code>$1</code>'),
          }}
        />
      ) : null,
    );
  });
}

export function ArenaBenchmark({ onComplete }: { onComplete: () => void }) {
  const [slots, setSlots] = useState<string[]>(['llama3.1:8b', 'mistral:7b']);
  const [prompt, setPrompt] = useState(BENCH_PROMPT);
  const [run, setRun] = useState<RunState>('idle');
  const [revealed, setRevealed] = useState<string[]>([]);
  const [addOpen, setAddOpen] = useState(false);

  function addSlot(id: string) {
    if (slots.length < 4 && !slots.includes(id)) setSlots((s) => [...s, id]);
    setAddOpen(false);
  }

  function removeSlot(id: string) {
    setSlots((s) => s.filter((x) => x !== id));
    setRevealed((r) => r.filter((x) => x !== id));
  }

  function start() {
    if (run === 'running' || slots.length === 0) return;
    setRun('running');
    setRevealed([]);
    slots.forEach((id, i) => {
      setTimeout(() => {
        setRevealed((r) => [...r, id]);
        if (i === slots.length - 1) setRun('done');
      }, 700 + i * 650);
    });
  }

  const available = MODELS.filter((m) => !slots.includes(m.id) && m.status !== 'pulling');
  const gridClass =
    slots.length <= 1
      ? styles.grid1
      : slots.length === 2
        ? styles.grid2
        : slots.length === 3
          ? styles.grid3
          : styles.grid4;

  return (
    <div className={styles.benchmark}>
      <div className={styles.slotBar}>
        <span className={styles.slotLabel}>Models</span>
        {slots.map((id) => {
          const m = MODELS.find((x) => x.id === id)!;
          return (
            <span key={id} className={styles.chip}>
              <span className={styles.chipDot} style={{ backgroundColor: m.accent }} />
              <span className={styles.chipName}>{m.name}</span>
              <span className={styles.chipParams}>{m.params}</span>
              <button
                type="button"
                onClick={() => removeSlot(id)}
                className={styles.chipRemove}
                aria-label={`Remove ${m.name}`}
              >
                <X size={14} />
              </button>
            </span>
          );
        })}

        {slots.length < 4 && (
          <div className={styles.addWrap}>
            <button type="button" className={styles.addBtn} onClick={() => setAddOpen((o) => !o)}>
              <Plus size={14} />
              Add model
              <ChevronDown size={14} />
            </button>
            {addOpen && (
              <div className={styles.addMenu}>
                <div className={styles.addList}>
                  {available.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      className={styles.addItem}
                      onClick={() => addSlot(m.id)}
                    >
                      <span className={styles.chipDot} style={{ backgroundColor: m.accent }} />
                      <span>{m.name}</span>
                      <span className={styles.chipParams}>{m.params}</span>
                    </button>
                  ))}
                  {available.length === 0 && (
                    <p className={styles.addEmpty}>All models added</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <span className={styles.slotCount}>{slots.length}/4 slots</span>
      </div>

      <div className={styles.columns}>
        {slots.length === 0 ? (
          <div className={styles.emptyColumns}>Add models to start a comparison.</div>
        ) : (
          <div className={gridClass}>
            {slots.map((id) => (
              <BenchColumn key={id} modelId={id} run={run} revealed={revealed.includes(id)} />
            ))}
          </div>
        )}
      </div>

      <div className={styles.composer}>
        <div className={styles.inputBox}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={1}
            placeholder="Shared prompt sent to every model…"
            className={styles.textarea}
          />
          {run === 'done' ? (
            <button type="button" onClick={onComplete} className={styles.resultsBtn}>
              View results
            </button>
          ) : (
            <button
              type="button"
              onClick={start}
              disabled={run === 'running' || slots.length === 0}
              className={styles.runBtn}
            >
              <Play size={16} strokeWidth={2.25} />
              {run === 'running' ? 'Running…' : `Run on ${slots.length}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function BenchColumn({
  modelId,
  run,
  revealed,
}: {
  modelId: string;
  run: RunState;
  revealed: boolean;
}) {
  const model = MODELS.find((m) => m.id === modelId)!;
  const result = BENCH_RESULTS.find((r) => r.modelId === modelId);
  const response = ARENA_RESPONSES[modelId];
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (revealed) scrollRef.current?.scrollTo({ top: 0 });
  }, [revealed]);

  const streaming = run === 'running' && !revealed;

  return (
    <div
      className={styles.column}
      style={{ boxShadow: `inset 0 2px 0 0 color-mix(in oklch, ${model.accent} 60%, transparent)` }}
    >
      <div className={styles.columnHeader}>
        <span className={styles.chipDot} style={{ backgroundColor: model.accent }} />
        <span className={styles.chipName}>{model.name}</span>
        <span className={styles.chipParams}>{model.params}</span>
        <span className={styles.slotCount}>{model.quant}</span>
      </div>

      <div ref={scrollRef} className={styles.columnBody}>
        {run === 'idle' && <p className={styles.waiting}>Waiting for run…</p>}
        {streaming && (
          <div className={styles.streaming}>
            <span className={`${styles.streamingDot} orbit-blink`} style={{ backgroundColor: model.accent }} />
            generating…
          </div>
        )}
        {revealed && (
          <div className={styles.messageContent}>{renderSimpleMarkdown(response)}</div>
        )}
      </div>

      {revealed && result && (
        <div className={styles.columnStats}>
          <div className={styles.stat}>
            <Gauge size={14} style={{ color: model.accent }} strokeWidth={1.75} />
            {result.tokensPerSec} t/s
          </div>
          <div className={styles.stat}>
            <Timer size={14} style={{ color: model.accent }} strokeWidth={1.75} />
            {(result.totalMs / 1000).toFixed(2)}s
          </div>
          <div className={styles.stat}>
            <Hash size={14} style={{ color: model.accent }} strokeWidth={1.75} />
            {result.totalTokens}
          </div>
        </div>
      )}
    </div>
  );
}
