import { Gauge, Timer, Hash } from 'lucide-react';
import styles from './MetricsBar.module.css';

interface MetricsBarProps {
  tokensPerSec: number | string;
  totalTimeMs: number;
  tokenCount: number;
  accentColor?: string;
}

export function MetricsBar({ tokensPerSec, totalTimeMs, tokenCount, accentColor }: MetricsBarProps) {
  const accent = accentColor || 'var(--primary)';
  return (
    <div className={`${styles.statsBar} ${styles.fadeIn}`}>
      <div className={styles.stat}>
        <Gauge size={14} style={{ color: accent }} strokeWidth={1.75} />
        {tokensPerSec} tok/s
      </div>
      <div className={styles.stat}>
        <Timer size={14} style={{ color: accent }} strokeWidth={1.75} />
        {(totalTimeMs / 1000).toFixed(2)}s
      </div>
      <div className={styles.stat}>
        <Hash size={14} style={{ color: accent }} strokeWidth={1.75} />
        {tokenCount}
      </div>
    </div>
  );
}
