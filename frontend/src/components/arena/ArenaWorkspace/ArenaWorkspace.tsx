import { useState, useEffect, useCallback } from 'react';
import { Swords, LayoutDashboard, History as HistoryIcon } from 'lucide-react';
import type { ModelItem, ModelConfig, ArenaModelResult, ArenaRunState, BenchmarkRecord } from '../../../types';
import { getModels } from '../../../services/ModelsMetaData';
import { runArena } from '../../../services/arenaService';
import { ArenaBenchmark } from '../ArenaBenchmark/ArenaBenchmark';
import { ResultsDashboard } from '../ResultsDashboard/ResultsDashboard';
import { ArenaHistory } from '../ArenaHistory/ArenaHistory';
import styles from './ArenaWorkspace.module.css';

type Tab = 'benchmark' | 'results' | 'history';

export function ArenaWorkspace() {
  const [tab, setTab] = useState<Tab>('benchmark');
  const [models, setModels] = useState<ModelItem[]>([]);
  
  // Persisted state
  const [slots, setSlots] = useState<string[]>(() => {
    const saved = localStorage.getItem('orbit_arena_slots');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [prompt, setPrompt] = useState(() => {
    return localStorage.getItem('orbit_arena_prompt') || '';
  });
  
  const [config, setConfig] = useState<ModelConfig>(() => {
    const saved = localStorage.getItem('orbit_arena_config');
    return saved ? JSON.parse(saved) : {
      temperature: 0.7,
      top_p: 0.9,
      num_predict: 2048,
      num_ctx: 8192,
    };
  });

  const [results, setResults] = useState<ArenaModelResult[]>(() => {
    const saved = localStorage.getItem('orbit_arena_results');
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState<BenchmarkRecord[]>(() => {
    const saved = localStorage.getItem('orbit_benchmark_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [runState, setRunState] = useState<ArenaRunState>('idle');
  const [activeModel, setActiveModel] = useState<string | null>(null);
  
  // Streams for real-time chunking
  const [streams, setStreams] = useState<Record<string, string>>({});

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('orbit_arena_slots', JSON.stringify(slots));
  }, [slots]);

  useEffect(() => {
    localStorage.setItem('orbit_arena_prompt', prompt);
  }, [prompt]);

  useEffect(() => {
    localStorage.setItem('orbit_arena_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    if (results.length > 0) {
      localStorage.setItem('orbit_arena_results', JSON.stringify(results));
    }
  }, [results]);

  useEffect(() => {
    localStorage.setItem('orbit_benchmark_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    async function fetchModels() {
      try {
        const data = await getModels();
        setModels(data.models);
      } catch (error) {
        console.error('Failed to fetch models:', error);
      }
    }
    fetchModels();
  }, []);

  const handleRun = useCallback(async () => {
    if (runState === 'running' || slots.length === 0 || !prompt.trim()) return;

    setRunState('running');
    setResults([]);
    setStreams({});
    setActiveModel(null);
    localStorage.removeItem('orbit_arena_results'); // clear old results

    try {
      await runArena(prompt, slots, {
        onModelStart: (model) => {
          setActiveModel(model);
          setStreams(prev => ({ ...prev, [model]: '' }));
        },
        onModelChunk: (model, text) => {
          setStreams(prev => ({ ...prev, [model]: prev[model] + text }));
        },
        onModelResult: (_model, data) => {
          setResults((prev) => [...prev, data]);
          setActiveModel(null);
        },
        onModelError: (model, message) => {
          console.error(`Arena error for ${model}:`, message);
          setActiveModel(null);
        },
        onComplete: () => {
          setRunState('done');
          setActiveModel(null);
          
          // Save to history
          setResults((finalResults) => {
            const record: BenchmarkRecord = {
              id: Date.now().toString(),
              timestamp: Date.now(),
              prompt: prompt,
              models: slots,
              results: finalResults,
            };
            setHistory((prev) => [record, ...prev]);
            return finalResults;
          });
        },
      }, config);
    } catch (error) {
      console.error('Arena run failed:', error);
      setRunState('done');
    }
  }, [runState, slots, prompt, config]);

  const handleReset = useCallback(() => {
    setRunState('idle');
    setResults([]);
    setStreams({});
    setActiveModel(null);
    localStorage.removeItem('orbit_arena_results');
  }, []);

  return (
    <div className={styles.workspace}>
      <div className={styles.tabBar}>
        <div className={styles.tabGroup}>
          <button
            type="button"
            className={`${styles.tabBtn} ${tab === 'benchmark' ? styles.tabBtnActive : ''}`}
            onClick={() => setTab('benchmark')}
          >
            <Swords size={16} strokeWidth={1.75} />
            Benchmark
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${tab === 'results' ? styles.tabBtnActive : ''}`}
            onClick={() => setTab('results')}
          >
            <LayoutDashboard size={16} strokeWidth={1.75} />
            Analysis
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${tab === 'history' ? styles.tabBtnActive : ''}`}
            onClick={() => setTab('history')}
          >
            <HistoryIcon size={16} strokeWidth={1.75} />
            History
          </button>
        </div>
        <p className={styles.tabHint}>
          {tab === 'benchmark'
            ? 'Run one prompt across up to 6 models sequentially'
            : tab === 'results'
              ? 'Real-time metrics, charts, and verdicts from the current run'
              : 'Browse and load past benchmark reports'}
        </p>
      </div>

      <div className={styles.content}>
        {tab === 'benchmark' ? (
          <ArenaBenchmark
            models={models}
            slots={slots}
            setSlots={setSlots}
            prompt={prompt}
            setPrompt={setPrompt}
            runState={runState}
            results={results}
            streams={streams}
            activeModel={activeModel}
            config={config}
            setConfig={setConfig}
            onRun={handleRun}
            onViewResults={() => setTab('results')}
            onReset={handleReset}
          />
        ) : tab === 'results' ? (
          <ResultsDashboard
            results={results}
            models={models}
            runState={runState}
            onRerun={handleRun}
            onReset={handleReset}
          />
        ) : (
          <ArenaHistory
            history={history}
            onLoad={(record) => {
              setSlots(record.models);
              setPrompt(record.prompt);
              setResults(record.results);
              setRunState('done');
              setTab('results');
            }}
            onDelete={(id) => setHistory(history.filter((h) => h.id !== id))}
          />
        )}
      </div>
    </div>
  );
}
