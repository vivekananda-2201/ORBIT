import { useState } from 'react';
import { Swords, LayoutDashboard } from 'lucide-react';
import { ArenaBenchmark } from './ArenaBenchmark';
import { ResultsDashboard } from './ResultsDashboard';
import styles from './ArenaWorkspace.module.css';

type Tab = 'benchmark' | 'results';

export function ArenaWorkspace() {
  const [tab, setTab] = useState<Tab>('benchmark');

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
        </div>
        <p className={styles.tabHint}>
          {tab === 'benchmark'
            ? 'Run one prompt across up to 4 models side by side'
            : 'Aggregated metrics, charts, and verdicts from the last run'}
        </p>
      </div>

      <div className={styles.content}>
        {tab === 'benchmark' ? (
          <ArenaBenchmark onComplete={() => setTab('results')} />
        ) : (
          <ResultsDashboard />
        )}
      </div>
    </div>
  );
}
