import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
  ComposedChart,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend
} from 'recharts';
import { Gauge, Timer, Zap, TrendingUp, Award, ArrowDownUp, Hash, Activity } from 'lucide-react';
import type { ModelItem, ArenaModelResult, ArenaRunState } from '../../../types';
import styles from './ResultsDashboard.module.css';

const ACCENTS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'oklch(0.6 0.15 300)',
];

function getModelDisplayName(model: string): string {
  const [name] = model.split(':');
  return name.replace(/[-_.]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ dataKey: string; name?: string; value: number | string; color?: string; payload?: any }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      {label && <p className={styles.tooltipLabel}>{label}</p>}
      {payload.map((p, i) => (
        <div key={i} className={styles.tooltipRow}>
          <span className={styles.tooltipDot} style={{ backgroundColor: p.color || p.payload?.fill || 'var(--primary)' }} />
          <span className={styles.tooltipName}>{p.name ?? p.dataKey}</span>
          <span className={styles.tooltipValue}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

function Panel({
  title,
  icon: Icon,
  children,
  className = '',
}: {
  title: string;
  icon: typeof Gauge;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`${styles.panel} ${className}`}>
      <div className={styles.panelHeader}>
        <Icon size={16} strokeWidth={1.75} color="var(--primary)" />
        <h3 className={styles.panelTitle}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

export function ResultsDashboard({
  results,
  models,
  runState,
  onRerun,
  onReset
}: {
  results: ArenaModelResult[];
  models: ModelItem[];
  runState: ArenaRunState;
  onRerun: () => void;
  onReset: () => void;
}) {
  if (results.length === 0) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.emptyState}>
          <h2 className={styles.emptyTitle}>No results yet</h2>
          <p className={styles.emptyDesc}>Run a benchmark to see analysis.</p>
        </div>
      </div>
    );
  }

  // Enrich results with model meta and colors
  const enriched = results.map((r, i) => {
    const meta = models.find(m => m.model === r.model);
    let sizeBillion = 0;
    if (meta?.details.parameter_size) {
      const match = meta.details.parameter_size.match(/([\d.]+)B/i);
      if (match) sizeBillion = parseFloat(match[1]);
    }
    
    return {
      ...r,
      displayName: getModelDisplayName(r.model),
      accent: ACCENTS[i % ACCENTS.length],
      meta,
      sizeBillion,
      efficiency: sizeBillion > 0 ? r.tokens_per_sec / sizeBillion : 0,
      total_time_s: parseFloat((r.total_ms / 1000).toFixed(2))
    };
  });

  const sortedByToks = [...enriched].sort((a, b) => b.tokens_per_sec - a.tokens_per_sec);
  const sortedByTtft = [...enriched].sort((a, b) => a.ttft_ms - b.ttft_ms);
  const sortedByEff = [...enriched].sort((a, b) => b.efficiency - a.efficiency);
  const sortedByTokens = [...enriched].sort((a, b) => b.response_tokens - a.response_tokens);

  const fastest = sortedByToks[0];
  const lowestLatency = sortedByTtft[0];
  const mostEfficient = sortedByEff[0];
  const mostVerbose = sortedByTokens[0];

  // Prepare data for Radar Chart (Normalized footprints)
  const maxToks = Math.max(...enriched.map(r => r.tokens_per_sec), 1);
  const minTtft = Math.min(...enriched.map(r => r.ttft_ms), 99999);
  const maxEff = Math.max(...enriched.map(r => r.efficiency), 0.1);

  const radarData = [
    { metric: 'Speed', ...Object.fromEntries(enriched.map(r => [r.displayName, Math.round((r.tokens_per_sec / maxToks) * 100)])) },
    { metric: 'Latency (Inv)', ...Object.fromEntries(enriched.map(r => [r.displayName, Math.round((minTtft / Math.max(r.ttft_ms, 1)) * 100)])) },
    { metric: 'Efficiency', ...Object.fromEntries(enriched.map(r => [r.displayName, Math.round((r.efficiency / maxEff) * 100)])) },
    { metric: 'Output Vol', ...Object.fromEntries(enriched.map(r => [r.displayName, Math.round((r.response_tokens / Math.max(...enriched.map(x=>x.response_tokens), 1)) * 100)])) }
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.inner}>
        <div className={styles.summary}>
          <div className={styles.summaryTitle}>
            <span className={styles.summaryDot} />
            Run Results
          </div>
          <span className={styles.summaryMeta}>
            {results.length} models · {runState === 'running' ? 'In progress...' : 'Completed'}
          </span>
          <div className={styles.summaryActions}>
            <button type="button" onClick={onReset} className={styles.btnSecondary}>
              Clear
            </button>
            <button type="button" onClick={onRerun} disabled={runState === 'running'} className={styles.btnPrimary}>
              {runState === 'running' ? 'Running...' : 'Re-run'}
            </button>
          </div>
        </div>

        <div className={styles.verdictGrid}>
          <VerdictCard icon={Zap} label="Fastest" model={fastest.displayName} value={`${fastest.tokens_per_sec} tok/s`} accent={fastest.accent} />
          <VerdictCard icon={Timer} label="Lowest latency" model={lowestLatency.displayName} value={`${lowestLatency.ttft_ms} ms TTFT`} accent={lowestLatency.accent} />
          <VerdictCard icon={Award} label="Most efficient" model={mostEfficient.displayName} value={`${mostEfficient.efficiency.toFixed(2)} tok/s per 1B params`} accent={mostEfficient.accent} />
          <VerdictCard icon={Hash} label="Most verbose" model={mostVerbose.displayName} value={`${mostVerbose.response_tokens} tokens`} accent={mostVerbose.accent} />
        </div>

        <div className={styles.chartGrid}>
          <Panel title="Throughput Comparison (tok/s)" icon={Gauge}>
            <div className={styles.chartBox}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedByToks} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" stroke="var(--muted-foreground)" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="displayName" stroke="var(--muted-foreground)" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={100} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--secondary)' }} />
                  <Bar dataKey="tokens_per_sec" name="tok/s" radius={[0, 4, 4, 0]}>
                    {sortedByToks.map((r) => (
                      <Cell key={r.model} fill={r.accent} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Performance Footprint (Normalized)" icon={Activity}>
            <div className={styles.chartBox}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  {enriched.map(r => (
                    <Radar key={r.model} name={r.displayName} dataKey={r.displayName} stroke={r.accent} fill={r.accent} fillOpacity={0.3} />
                  ))}
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className={`${styles.chartGrid} ${styles.chartGridHalf}`}>
          <Panel title="Timeline Breakdown (Load vs TTFT vs Gen)" icon={Timer}>
            <div className={styles.chartBoxSm}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={enriched} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" stroke="var(--muted-foreground)" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="displayName" stroke="var(--muted-foreground)" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={100} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--secondary)' }} />
                  
                  <Bar dataKey="load_time_ms" name="Load Time (ms)" stackId="a" fill="var(--muted-foreground)" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="ttft_ms" name="TTFT (ms)" stackId="a" fill="var(--muted)" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="total_ms" name="Total (ms)" stackId="a" radius={[0, 4, 4, 0]}>
                    {enriched.map((r) => <Cell key={r.model} fill={r.accent} />)}
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Efficiency (Tok/s vs Parameters)" icon={TrendingUp}>
            <div className={styles.chartBoxSm}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border)" />
                  <XAxis type="number" dataKey="sizeBillion" name="Params (B)" stroke="var(--muted-foreground)" tick={{ fontSize: 10 }} tickLine={false} />
                  <YAxis type="number" dataKey="tokens_per_sec" name="tok/s" stroke="var(--muted-foreground)" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <ZAxis type="number" range={[150, 150]} />
                  <Tooltip content={<ChartTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                  {enriched.map((r) => (
                    <Scatter key={r.model} name={r.displayName} data={[r]} fill={r.accent} />
                  ))}
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <Panel title="Leaderboard" icon={ArrowDownUp}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th>#</th>
                  <th>Model</th>
                  <th style={{ textAlign: 'right' }}>Throughput</th>
                  <th style={{ textAlign: 'right' }}>TTFT</th>
                  <th style={{ textAlign: 'right' }}>Load Time</th>
                  <th style={{ textAlign: 'right' }}>Total Time</th>
                  <th style={{ textAlign: 'right' }}>Tokens</th>
                  <th style={{ textAlign: 'right' }}>Verdict</th>
                </tr>
              </thead>
              <tbody>
                {sortedByToks.map((r, i) => (
                  <tr key={r.model} className={styles.tableRow}>
                    <td className={styles.muted}>{i + 1}</td>
                    <td>
                      <div className={styles.tableModel}>
                        <span className={styles.summaryDot} style={{ backgroundColor: r.accent }} />
                        {r.displayName}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>{r.tokens_per_sec} t/s</td>
                    <td style={{ textAlign: 'right' }} className={styles.muted}>{r.ttft_ms} ms</td>
                    <td style={{ textAlign: 'right' }} className={styles.muted}>{r.load_time_ms} ms</td>
                    <td style={{ textAlign: 'right' }} className={styles.muted}>{r.total_time_s}s</td>
                    <td style={{ textAlign: 'right' }} className={styles.muted}>{r.response_tokens}</td>
                    <td style={{ textAlign: 'right' }}>
                      <span
                        className={styles.badge}
                        style={{
                          borderColor: `color-mix(in oklch, ${r.accent} 40%, transparent)`,
                          color: r.accent,
                        }}
                      >
                        {i === 0 ? 'Fastest' : r.model === lowestLatency.model ? 'Lowest Latency' : r.model === mostEfficient.model ? 'Most Efficient' : '-'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function VerdictCard({
  icon: Icon,
  label,
  model,
  value,
  accent,
}: {
  icon: typeof Gauge;
  label: string;
  model: string;
  value: string;
  accent: string;
}) {
  return (
    <div className={styles.verdictCard}>
      <div className={styles.verdictGlow} style={{ backgroundColor: accent }} />
      <div className={styles.verdictLabel}>
        <Icon size={14} style={{ color: accent }} strokeWidth={1.75} />
        {label}
      </div>
      <p className={styles.verdictModel}>{model}</p>
      <p className={styles.verdictValue} style={{ color: accent }}>
        {value}
      </p>
    </div>
  );
}
