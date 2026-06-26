import { Trash2, History } from 'lucide-react';
import type { BenchmarkRecord } from '../../../types';
import styles from './ArenaHistory.module.css';

interface ArenaHistoryProps {
  history: BenchmarkRecord[];
  onLoad: (record: BenchmarkRecord) => void;
  onDelete: (id: string) => void;
}

export function ArenaHistory({ history, onLoad, onDelete }: ArenaHistoryProps) {
  if (history.length === 0) {
    return (
      <div className={styles.emptyState}>
        <History size={48} strokeWidth={1} style={{ marginBottom: '1rem', opacity: 0.5 }} />
        <p>No benchmark history found.</p>
        <span style={{ fontSize: '12px', marginTop: '0.5rem' }}>Run a benchmark and it will be saved here automatically.</span>
      </div>
    );
  }

  return (
    <div className={styles.historyContainer}>
      <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Saved Benchmarks</h2>
      <div className={styles.historyList}>
        {history.map((record) => (
          <div key={record.id} className={styles.historyItem}>
            <div className={styles.historyInfo}>
              <div className={styles.historyPrompt}>
                {record.prompt.length > 50 ? record.prompt.substring(0, 50) + '...' : record.prompt}
              </div>
              <div className={styles.historyMeta}>
                {new Date(record.timestamp).toLocaleString()} · {record.models.length} models
              </div>
            </div>
            <div className={styles.historyActions}>
              <button
                type="button"
                className={styles.viewBtn}
                onClick={() => onLoad(record)}
              >
                View
              </button>
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={() => onDelete(record.id)}
                aria-label="Delete record"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
