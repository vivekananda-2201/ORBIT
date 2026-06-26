import { useState, useRef, useEffect } from 'react';
import { Plus, X, Play, ChevronDown, Sliders, RefreshCw } from 'lucide-react';
import type { ModelItem, ModelConfig, ArenaModelResult, ArenaRunState } from '../../../types';
import { MetricsBar } from '../../common/MetricsBar/MetricsBar';
import styles from './ArenaBenchmark.module.css';

const ACCENTS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'oklch(0.6 0.15 300)', // 6th color
];

function getModelDisplayName(model: string): string {
  const [name] = model.split(':');
  return name.replace(/[-_.]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function ArenaBenchmark({
  models,
  slots,
  setSlots,
  prompt,
  setPrompt,
  runState,
  results,
  streams,
  activeModel,
  config,
  setConfig,
  onRun,
  onViewResults,
  onReset,
}: {
  models: ModelItem[];
  slots: string[];
  setSlots: React.Dispatch<React.SetStateAction<string[]>>;
  prompt: string;
  setPrompt: (p: string) => void;
  runState: ArenaRunState;
  results: ArenaModelResult[];
  streams: Record<string, string>;
  activeModel: string | null;
  config: ModelConfig;
  setConfig: React.Dispatch<React.SetStateAction<ModelConfig>>;
  onRun: () => void;
  onViewResults: () => void;
  onReset: () => void;
}) {
  const [addOpen, setAddOpen] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  function addSlot(id: string) {
    if (slots.length < 6 && !slots.includes(id)) {
      setSlots((s) => [...s, id]);
    }
    setAddOpen(false);
  }

  function removeSlot(id: string) {
    if (runState === 'running') return;
    setSlots((s) => s.filter((x) => x !== id));
  }

  const available = models.filter((m) => !slots.includes(m.model));
  const gridClass =
    slots.length <= 1
      ? styles.grid1
      : slots.length === 2
        ? styles.grid2
        : slots.length === 3
          ? styles.grid3
          : slots.length <= 4
            ? styles.grid4
            : slots.length === 5
              ? styles.grid5
              : styles.grid6;

  return (
    <div className={styles.benchmark}>
      <div className={styles.slotBar}>
        <span className={styles.slotLabel}>Models</span>
        {slots.map((id, index) => {
          const m = models.find((x) => x.model === id);
          if (!m) return null;
          const accent = ACCENTS[index % ACCENTS.length];
          return (
            <span key={id} className={styles.chip}>
              <span className={styles.chipDot} style={{ backgroundColor: accent }} />
              <span className={styles.chipName}>{getModelDisplayName(m.model)}</span>
              <span className={styles.chipParams}>{m.details.parameter_size}</span>
              <button
                type="button"
                onClick={() => removeSlot(id)}
                className={styles.chipRemove}
                aria-label={`Remove ${m.model}`}
                disabled={runState === 'running'}
              >
                <X size={14} />
              </button>
            </span>
          );
        })}

        {slots.length < 6 && runState !== 'running' && (
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
                      key={m.model}
                      type="button"
                      className={styles.addItem}
                      onClick={() => addSlot(m.model)}
                    >
                      <span className={styles.chipDot} style={{ backgroundColor: 'var(--muted-foreground)' }} />
                      <span>{getModelDisplayName(m.model)}</span>
                      <span className={styles.chipParams}>{m.details.parameter_size}</span>
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

        <div className={styles.slotBarRight}>
          <button
            type="button"
            className={`${styles.configToggle} ${showConfig ? styles.configToggleActive : ''}`}
            onClick={() => setShowConfig(!showConfig)}
          >
            <Sliders size={14} />
            Config
          </button>
          <span className={styles.slotCount}>{slots.length}/6 slots</span>
        </div>
      </div>

      {showConfig && (
        <div className={styles.configPanel}>
          <div className={styles.configGrid}>
            <label className={styles.configItem}>
              <span>Temperature: {config.temperature}</span>
              <input type="range" min="0" max="2" step="0.1" value={config.temperature} onChange={e => setConfig({...config, temperature: parseFloat(e.target.value)})} />
            </label>
            <label className={styles.configItem}>
              <span>Top P: {config.top_p}</span>
              <input type="range" min="0" max="1" step="0.05" value={config.top_p} onChange={e => setConfig({...config, top_p: parseFloat(e.target.value)})} />
            </label>
            <label className={styles.configItem}>
              <span>Max Tokens: {config.num_predict}</span>
              <input type="range" min="256" max="8192" step="256" value={config.num_predict} onChange={e => setConfig({...config, num_predict: parseInt(e.target.value, 10)})} />
            </label>
            <label className={styles.configItem}>
              <span>Context: {config.num_ctx}</span>
              <input type="range" min="2048" max="32768" step="2048" value={config.num_ctx} onChange={e => setConfig({...config, num_ctx: parseInt(e.target.value, 10)})} />
            </label>
          </div>
        </div>
      )}

      <div className={styles.columns}>
        {slots.length === 0 ? (
          <div className={styles.emptyColumns}>Add models to start a comparison.</div>
        ) : (
          <div className={gridClass}>
            {slots.map((id, index) => {
              const accent = ACCENTS[index % ACCENTS.length];
              return (
                <BenchColumn
                  key={id}
                  modelId={id}
                  models={models}
                  accent={accent}
                  runState={runState}
                  activeModel={activeModel}
                  result={results.find((r) => r.model === id)}
                  streamText={streams[id]}
                />
              );
            })}
          </div>
        )}
      </div>

      <div className={styles.composer}>
        <div className={styles.inputBox}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={1}
            placeholder="Shared prompt sent to every model sequentially…"
            className={styles.textarea}
            disabled={runState === 'running'}
          />
          {runState === 'done' ? (
            <>
              <button type="button" onClick={onReset} className={styles.iconBtn}>
                 <RefreshCw size={16} />
              </button>
              <button type="button" onClick={onViewResults} className={styles.resultsBtn}>
                View results
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onRun}
              disabled={runState === 'running' || slots.length === 0 || !prompt.trim()}
              className={styles.runBtn}
            >
              <Play size={16} strokeWidth={2.25} />
              {runState === 'running' ? 'Running…' : `Run on ${slots.length}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function BenchColumn({
  modelId,
  models,
  accent,
  runState,
  activeModel,
  result,
  streamText,
}: {
  modelId: string;
  models: ModelItem[];
  accent: string;
  runState: ArenaRunState;
  activeModel: string | null;
  result?: ArenaModelResult;
  streamText?: string;
}) {
  const model = models.find((m) => m.model === modelId);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isGenerating = activeModel === modelId;
  const isWaiting = runState === 'running' && !isGenerating && !result;

  useEffect(() => {
    if (result || isGenerating) {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
    }
  }, [result, isGenerating, streamText]);

  if (!model) return null;

  return (
    <div
      className={styles.column}
      style={{ boxShadow: `inset 0 2px 0 0 color-mix(in oklch, ${accent} 60%, transparent)` }}
    >
      <div className={styles.columnHeader}>
        <span className={styles.chipDot} style={{ backgroundColor: accent }} />
        <span className={styles.chipName}>{getModelDisplayName(model.model)}</span>
        <span className={styles.chipParams}>{model.details.parameter_size}</span>
        <span className={styles.slotCount}>{model.details.quantization_level}</span>
      </div>

      <div ref={scrollRef} className={styles.columnBody}>
        {runState === 'idle' && <p className={styles.waiting}>Waiting for run…</p>}
        {isWaiting && <p className={styles.waiting}>Queued…</p>}
        {isGenerating && (
          <div className={`${styles.messageContent} ${styles.fadeIn}`}>
            {streamText ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{streamText}</ReactMarkdown> : ''}
            <div className={styles.streaming}>
              <span className={`${styles.streamingDot} orbit-blink`} style={{ backgroundColor: accent }} />
              generating…
            </div>
          </div>
        )}
        {result && (
          <div className={styles.responseContent}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.response}</ReactMarkdown>
        </div>
        )}
      </div>

      {result && (
        <MetricsBar
          tokensPerSec={result.tokens_per_sec}
          totalTimeMs={result.total_ms * 1000}
          tokenCount={result.response_tokens}
          accentColor={accent}
        />
      )}
    </div>
  );
}
