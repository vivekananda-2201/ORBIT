import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { Download, Play, RefreshCw, Layers } from 'lucide-react';
import shared from '../styles/shared.module.css';
import styles from './Benchmarks.module.css';

const performanceData = [
  { context: '1k', llama3: 72, mistral: 85, phi3: 65 },
  { context: '2k', llama3: 68, mistral: 79, phi3: 63 },
  { context: '4k', llama3: 55, mistral: 64, phi3: 60 },
  { context: '8k', llama3: 41, mistral: 45, phi3: 58 },
  { context: '16k', llama3: 22, mistral: 28, phi3: 45 },
  { context: '32k', llama3: 8, mistral: 12, phi3: 30 },
];

const capabilitiesData = [
  { subject: 'Coding', llama3: 85, mistral: 75, phi3: 65, fullMark: 100 },
  { subject: 'Reasoning', llama3: 80, mistral: 88, phi3: 70, fullMark: 100 },
  { subject: 'Math', llama3: 65, mistral: 72, phi3: 80, fullMark: 100 },
  { subject: 'Creative', llama3: 90, mistral: 82, phi3: 60, fullMark: 100 },
  { subject: 'Context', llama3: 70, mistral: 75, phi3: 95, fullMark: 100 },
  { subject: 'Speed', llama3: 60, mistral: 55, phi3: 90, fullMark: 100 },
];

const latencyData = [
  { name: 'llama3:8b', promptEval: 120, generation: 45, type: 'Q4_0' },
  { name: 'mistral:7b', promptEval: 140, generation: 38, type: 'Q4_K_M' },
  { name: 'phi3:mini', promptEval: 85, generation: 60, type: 'F16' },
  { name: 'gemma:7b', promptEval: 180, generation: 30, type: 'Q4_0' },
];

const tooltipStyle = {
  backgroundColor: '#18181b',
  border: '1px solid #27272a',
  borderRadius: '8px',
};

export function Benchmarks() {
  return (
    <div className={shared.pageContainerWide}>
      <div className={styles.header}>
        <div>
          <h1 className={shared.pageTitle}>Metrics & Benchmarking</h1>
          <p className={shared.pageSubtitle}>
            Analyze local model performance across various context lengths and
            tasks.
          </p>
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.exportBtn}>
            <Download size={16} /> Export Report
          </button>
          <button type="button" className={styles.runBtn}>
            <Play size={16} /> Run Suite
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.chartPanel}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Tokens/sec vs Context Length</h3>
            <button type="button" className={styles.refreshBtn}>
              <RefreshCw size={16} />
            </button>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={performanceData}
                margin={{ top: 5, right: 20, bottom: 5, left: -20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#27272a"
                  vertical={false}
                />
                <XAxis
                  dataKey="context"
                  stroke="#71717a"
                  tick={{ fill: '#71717a' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#71717a"
                  tick={{ fill: '#71717a' }}
                  axisLine={false}
                  tickLine={false}
                />
                <RechartsTooltip
                  contentStyle={tooltipStyle}
                  itemStyle={{ color: '#e4e4e7' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="llama3"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#10b981' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="mistral"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#06b6d4' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="phi3"
                  stroke="#a855f7"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#a855f7' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.chartPanel}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>Capability Radar</h3>
            <div className={styles.chartMeta}>
              <Layers size={16} /> MMLU + HumanEval
            </div>
          </div>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="70%"
                data={capabilitiesData}
              >
                <PolarGrid stroke="#27272a" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#a1a1aa' }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={false}
                  axisLine={false}
                />
                <Radar
                  name="llama3:8b"
                  dataKey="llama3"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.2}
                />
                <Radar
                  name="mistral:7b"
                  dataKey="mistral"
                  stroke="#06b6d4"
                  fill="#06b6d4"
                  fillOpacity={0.2}
                />
                <Radar
                  name="phi3:mini"
                  dataKey="phi3"
                  stroke="#a855f7"
                  fill="#a855f7"
                  fillOpacity={0.2}
                />
                <Legend />
                <RechartsTooltip contentStyle={tooltipStyle} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${styles.chartPanel} ${styles.chartPanelWide}`}>
          <h3 className={styles.chartTitle}>
            Latency Breakdown (ms/token)
          </h3>
          <div className={`${styles.chartContainer} ${styles.chartContainerShort}`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={latencyData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#27272a"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  stroke="#71717a"
                  tick={{ fill: '#71717a' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#e4e4e7"
                  tick={{ fill: '#e4e4e7' }}
                  axisLine={false}
                  tickLine={false}
                  width={100}
                />
                <RechartsTooltip
                  cursor={{ fill: '#27272a', opacity: 0.4 }}
                  contentStyle={tooltipStyle}
                />
                <Legend />
                <Bar
                  dataKey="promptEval"
                  name="Prompt Eval (Time to First Token)"
                  stackId="a"
                  fill="#3f3f46"
                  radius={[4, 0, 0, 4]}
                />
                <Bar
                  dataKey="generation"
                  name="Generation (Per Token)"
                  stackId="a"
                  fill="#10b981"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
