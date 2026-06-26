import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { Gauge, Timer, Zap, Trophy, TrendingUp, Award, ArrowDownUp } from 'lucide-react';
import { BENCH_RESULTS, THROUGHPUT_SERIES, QUALITY_RADAR, MODELS } from '../../../utils/orbit-data';
import styles from './ResultsDashboard.module.css';

const ACTIVE = ['llama3.1:8b', 'mistral:7b', 'qwen2.5:14b', 'phi3:3.8b'];

function modelMeta(id: string) {
  return MODELS.find((m) => m.id === id);
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ dataKey: string; name?: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      {label && <p className={styles.tooltipLabel}>{label}</p>}
      {payload.map((p) => (
        <div key={p.dataKey} className={styles.tooltipRow}>
          <span className={styles.tooltipDot} style={{ backgroundColor: p.color }} />
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

const VERDICT_LABEL: Record<string, string> = {
  fastest: 'Fastest',
  balanced: 'Balanced',
  'highest-quality': 'Highest quality',
  'most-efficient': 'Most efficient',
};

export function ResultsDashboard() {
  const fastest = [...BENCH_RESULTS].sort((a, b) => b.tokensPerSec - a.tokensPerSec)[0];
  const best = [...BENCH_RESULTS].sort((a, b) => b.quality - a.quality)[0];
  const lowestLatency = [...BENCH_RESULTS].sort((a, b) => a.ttftMs - b.ttftMs)[0];
  const ranked = [...BENCH_RESULTS].sort((a, b) => b.quality / b.totalMs - a.quality / a.totalMs);

  return (
    <div className={styles.dashboard}>
      <div className={styles.inner}>
        <div className={styles.summary}>
          <div className={styles.summaryTitle}>
            <span className={styles.summaryDot} />
            Benchmark #0427
          </div>
          <span className={styles.summaryMeta}>
            4 models · 1 prompt · 5 trials · completed 2m ago
          </span>
          <div className={styles.summaryActions}>
            <button type="button" className={styles.btnSecondary}>
              Export JSON
            </button>
            <button type="button" className={styles.btnPrimary}>
              Re-run
            </button>
          </div>
        </div>

        <div className={styles.verdictGrid}>
          <VerdictCard icon={Zap} label="Fastest" model={fastest.name} value={`${fastest.tokensPerSec} tok/s`} accent={fastest.accent} />
          <VerdictCard icon={Trophy} label="Highest quality" model={best.name} value={`${best.quality}/100`} accent={best.accent} />
          <VerdictCard icon={Timer} label="Lowest latency" model={lowestLatency.name} value={`${lowestLatency.ttftMs}ms TTFT`} accent={lowestLatency.accent} />
          <VerdictCard icon={Award} label="Best value" model={ranked[0].name} value="quality / ms" accent={ranked[0].accent} />
        </div>

        <div className={styles.chartGrid}>
          <Panel title="Throughput over generation" icon={TrendingUp}>
            <div className={styles.chartBox}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={THROUGHPUT_SERIES} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="t" stroke="var(--muted-foreground)" tick={{ fontSize: 10 }} tickLine={false} />
                  <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  {ACTIVE.map((id) => (
                    <Line
                      key={id}
                      type="monotone"
                      dataKey={id}
                      name={modelMeta(id)?.name}
                      stroke={modelMeta(id)?.accent}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 3 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <Legend />
          </Panel>

          <Panel title="Quality profile" icon={Award}>
            <div className={styles.chartBox}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={QUALITY_RADAR} outerRadius="72%">
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }} />
                  {ACTIVE.map((id) => (
                    <Radar
                      key={id}
                      dataKey={id}
                      name={modelMeta(id)?.name}
                      stroke={modelMeta(id)?.accent}
                      fill={modelMeta(id)?.accent}
                      fillOpacity={0.08}
                      strokeWidth={1.5}
                    />
                  ))}
                  <Tooltip content={<ChartTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className={`${styles.chartGrid} ${styles.chartGridHalf}`}>
          <Panel title="Average throughput" icon={Gauge}>
            <div className={styles.chartBoxSm}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={BENCH_RESULTS} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" stroke="var(--muted-foreground)" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" stroke="var(--muted-foreground)" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={84} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--secondary)' }} />
                  <Bar dataKey="tokensPerSec" name="tok/s" radius={[0, 4, 4, 0]}>
                    {BENCH_RESULTS.map((r) => (
                      <Cell key={r.modelId} fill={r.accent} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Time to first token" icon={Timer}>
            <div className={styles.chartBoxSm}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={BENCH_RESULTS} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" stroke="var(--muted-foreground)" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" stroke="var(--muted-foreground)" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={84} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--secondary)' }} />
                  <Bar dataKey="ttftMs" name="ms" radius={[0, 4, 4, 0]} fillOpacity={0.55}>
                    {BENCH_RESULTS.map((r) => (
                      <Cell key={r.modelId} fill={r.accent} />
                    ))}
                  </Bar>
                </BarChart>
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
                  <th style={{ textAlign: 'right' }}>Total</th>
                  <th style={{ textAlign: 'right' }}>Tokens</th>
                  <th style={{ textAlign: 'right' }}>Quality</th>
                  <th style={{ textAlign: 'right' }}>Verdict</th>
                </tr>
              </thead>
              <tbody>
                {ranked.map((r, i) => (
                  <tr key={r.modelId} className={styles.tableRow}>
                    <td className={styles.muted}>{i + 1}</td>
                    <td>
                      <div className={styles.tableModel}>
                        <span className={styles.summaryDot} style={{ backgroundColor: r.accent }} />
                        {r.name}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>{r.tokensPerSec} t/s</td>
                    <td style={{ textAlign: 'right' }} className={styles.muted}>{r.ttftMs}ms</td>
                    <td style={{ textAlign: 'right' }} className={styles.muted}>{(r.totalMs / 1000).toFixed(2)}s</td>
                    <td style={{ textAlign: 'right' }} className={styles.muted}>{r.totalTokens}</td>
                    <td style={{ textAlign: 'right' }}>{r.quality}</td>
                    <td style={{ textAlign: 'right' }}>
                      <span
                        className={styles.badge}
                        style={{
                          borderColor: `color-mix(in oklch, ${r.accent} 40%, transparent)`,
                          color: r.accent,
                        }}
                      >
                        {VERDICT_LABEL[r.verdict]}
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

function Legend() {
  return (
    <div className={styles.legend}>
      {ACTIVE.map((id) => (
        <div key={id} className={styles.legendItem}>
          <span className={styles.legendLine} style={{ backgroundColor: modelMeta(id)?.accent }} />
          {modelMeta(id)?.name}
        </div>
      ))}
    </div>
  );
}
