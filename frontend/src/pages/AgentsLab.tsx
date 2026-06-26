import {
  Bot,
  Wrench,
  TerminalSquare,
  Activity,
  GitCommit,
  Search,
  Code2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import shared from '../styles/shared.module.css';
import styles from './AgentsLab.module.css';

const agentMetrics = [
  { model: 'llama3:8b', taskSuccess: 82, toolAccuracy: 88, avgSteps: 5.4 },
  { model: 'mistral:7b', taskSuccess: 74, toolAccuracy: 79, avgSteps: 7.2 },
  { model: 'phi3:mini', taskSuccess: 55, toolAccuracy: 62, avgSteps: 11.5 },
  { model: 'qwen2:7b', taskSuccess: 85, toolAccuracy: 91, avgSteps: 4.8 },
];

const stepsData = [
  { task: 'Web Research', llama3: 4, mistral: 6, qwen2: 4 },
  { task: 'Data Clean', llama3: 7, mistral: 9, qwen2: 5 },
  { task: 'Code Gen', llama3: 5, mistral: 6, qwen2: 4 },
  { task: 'Debug API', llama3: 8, mistral: 12, qwen2: 7 },
  { task: 'Summarize', llama3: 2, mistral: 3, qwen2: 2 },
];

const tooltipStyle = {
  backgroundColor: '#18181b',
  border: '1px solid #27272a',
  borderRadius: '8px',
};

const STATS = [
  {
    label: 'Active Agents',
    value: '3',
    icon: <Bot size={16} color="var(--orbit-purple)" />,
  },
  {
    label: 'Global Tool Accuracy',
    value: '81.4%',
    icon: <CheckCircle2 size={16} color="var(--orbit-accent)" />,
  },
  {
    label: 'Avg Steps to Success',
    value: '6.8',
    icon: <GitCommit size={16} color="var(--orbit-cyan)" />,
  },
  {
    label: 'Loop Failures (24h)',
    value: '12',
    icon: <AlertTriangle size={16} color="#fbbf24" />,
  },
];

export function AgentsLab() {
  return (
    <div className={shared.pageContainerWide}>
      <div className={styles.header}>
        <div>
          <h1 className={shared.pageTitle}>Agentic Workflows & Metrics</h1>
          <p className={shared.pageSubtitle}>
            Evaluate autonomous agents, tool-calling accuracy, and ReAct loop
            efficiency.
          </p>
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.manageBtn}>
            <Wrench size={16} /> Manage Tools
          </button>
          <button type="button" className={styles.newAgentBtn}>
            <Bot size={16} /> New Agent
          </button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        {STATS.map((stat) => (
          <div key={stat.label} className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>{stat.label}</span>
              {stat.icon}
            </div>
            <span className={styles.statValue}>{stat.value}</span>
          </div>
        ))}
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.chartsColumn}>
          <div className={styles.chartPanel}>
            <div className={styles.chartHeader}>
              <h3 className={styles.chartTitle}>
                Agent Performance Benchmarks (%)
              </h3>
              <div className={styles.chartMeta}>
                <Activity size={16} /> 100 Runs Evaluated
              </div>
            </div>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={agentMetrics}
                  margin={{ top: 5, right: 0, left: -20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#27272a"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="model"
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
                    domain={[0, 100]}
                  />
                  <RechartsTooltip
                    cursor={{ fill: '#27272a', opacity: 0.4 }}
                    contentStyle={tooltipStyle}
                  />
                  <Legend />
                  <Bar
                    dataKey="taskSuccess"
                    name="Task Success Rate"
                    fill="#a855f7"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="toolAccuracy"
                    name="Tool Selection Accuracy"
                    fill="#06b6d4"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={styles.chartPanel}>
            <h3 className={styles.chartTitle}>
              Trajectory Efficiency (Steps to Completion)
            </h3>
            <div className={`${styles.chartContainer} ${styles.chartContainerShort}`}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={stepsData}
                  margin={{ top: 5, right: 20, bottom: 5, left: -20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#27272a"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="task"
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
                  <RechartsTooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="llama3"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mistral"
                    stroke="#a855f7"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="qwen2"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className={styles.sidebarColumn}>
          <div className={styles.chartPanel}>
            <h3 className={styles.chartTitle}>Active Workflows</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className={`${styles.agentCard} ${styles.agentCardActive}`}>
                <div className={`${styles.agentAccent} ${styles.agentAccentPurple}`} />
                <div className={styles.agentHeader}>
                  <div className={styles.agentName}>
                    <Bot size={16} color="var(--orbit-purple)" />
                    <span>Research_Agent_1</span>
                  </div>
                  <span className={styles.statusRunning}>
                    <span className={styles.pulseDot} />
                    Running
                  </span>
                </div>
                <div className={styles.agentMeta}>
                  <span className={styles.modelTag}>llama3:8b</span>
                  <div className={styles.toolIcons}>
                    <div className={styles.toolIcon} title="Web Search">
                      <Search size={12} color="var(--orbit-cyan)" />
                    </div>
                    <div className={styles.toolIcon} title="Code Exec">
                      <Code2 size={12} color="var(--orbit-accent)" />
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${styles.agentCard} ${styles.agentCardIdle}`}>
                <div className={`${styles.agentAccent} ${styles.agentAccentGray}`} />
                <div className={styles.agentHeader}>
                  <div className={`${styles.agentName} ${styles.agentNameIdle}`}>
                    <Bot size={16} color="var(--orbit-zinc-400)" />
                    <span>Data_Cleaner_v2</span>
                  </div>
                  <span className={styles.statusIdleBadge}>Idle</span>
                </div>
                <div className={styles.agentMeta}>
                  <span className={styles.modelTag}>mistral:7b</span>
                  <div className={styles.toolIcons}>
                    <div className={styles.toolIcon} title="File System">
                      <TerminalSquare size={12} color="#fbbf24" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.tracePanel}>
            <div className={styles.traceHeader}>
              <div className={styles.traceTitle}>
                <TerminalSquare size={16} color="var(--orbit-purple)" />
                <span>Live ReAct Trace</span>
              </div>
              <span className={styles.traceAgent}>Research_Agent_1</span>
            </div>
            <div className={styles.traceBody}>
              <div className={styles.traceSystem}>
                <span className={styles.traceSystemLabel}>System:</span> Task
                assigned - &quot;Find the latest release notes for React 19 and
                summarize the new hooks.&quot;
              </div>
              <div className={`${styles.traceBlock} ${styles.traceThought}`}>
                <span className={styles.traceLabelThought}>Thought:</span>
                <span className={styles.traceText}>
                  I need to search the web for the official React 19 release notes
                  to get the most accurate and up-to-date information.
                </span>
              </div>
              <div className={`${styles.traceBlock} ${styles.traceAction}`}>
                <span className={styles.traceLabelAction}>Action: web_search</span>
                <span className={styles.traceTextMuted}>
                  {'{ "query": "React 19 official release notes new hooks" }'}
                </span>
              </div>
              <div className={`${styles.traceBlock} ${styles.traceObservation}`}>
                <span className={styles.traceLabelObservation}>Observation:</span>
                <span className={styles.traceTextMuted}>
                  Found 3 results. Official blog post states React 19 introduces
                  useActionState, useFormStatus, useOptimistic, and the generic
                  use() API for promises and context...
                </span>
              </div>
              <div className={`${styles.traceBlock} ${styles.traceThought}`}>
                <span className={styles.traceLabelThought}>Thought:</span>
                <span className={styles.traceText}>
                  I have the information about the new hooks. I will now format
                  this into a clear summary for the user.
                  <span className={styles.inlinePulse} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
