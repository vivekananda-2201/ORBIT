import { useNavigate } from 'react-router';
import {
  Database,
  Plus,
  Zap,
  Box,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react';
import shared from '../styles/shared.module.css';
import styles from './Dashboard.module.css';

const RECENT_EXPERIMENTS = [
  {
    title: 'Llama3 vs Mistral: JSON Formatting',
    time: '2 hours ago',
    type: 'Chat',
    typeClass: styles.typeChat,
  },
  {
    title: 'RAG Setup: PDF Manual parsing',
    time: '5 hours ago',
    type: 'RAG Lab',
    typeClass: styles.typeRag,
  },
  {
    title: 'Code Eval: Python algorithms',
    time: 'Yesterday',
    type: 'Benchmark',
    typeClass: styles.typeBenchmark,
  },
  {
    title: 'Phi-3 Mini Context Scaling',
    time: '2 days ago',
    type: 'Benchmark',
    typeClass: styles.typeBenchmark,
  },
];

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className={shared.pageContainer}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Welcome to{' '}
            <span className={styles.titleAccent}>ORBIT</span>
          </h1>
          <p className={styles.subtitle}>
            Operational Research and Benchmarking Interface for Transformers
          </p>
        </div>
        <button type="button" className={styles.newExperimentBtn}>
          <Plus size={16} />
          <span>New Experiment</span>
        </button>
      </div>

      <div className={styles.quickActions}>
        <div
          role="button"
          tabIndex={0}
          className={`${styles.actionCard} ${styles.actionCardEmerald}`}
          onClick={() => navigate('/chat')}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/chat')}
        >
          <div className={`${styles.actionIcon} ${styles.actionIconEmerald}`}>
            <MessageSquare size={20} />
          </div>
          <h3 className={styles.actionTitle}>Open Chat</h3>
          <p className={styles.actionDesc}>
            Interact with your locally running language models with real-time
            streaming.
          </p>
        </div>

        <div
          role="button"
          tabIndex={0}
          className={`${styles.actionCard} ${styles.actionCardCyan}`}
          onClick={() => navigate('/benchmarks')}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/benchmarks')}
        >
          <div className={`${styles.actionIcon} ${styles.actionIconCyan}`}>
            <Zap size={20} />
          </div>
          <h3 className={styles.actionTitle}>Run Benchmarks</h3>
          <p className={styles.actionDesc}>
            Evaluate latency, context limits, and reasoning capabilities.
          </p>
        </div>

        <div
          role="button"
          tabIndex={0}
          className={`${styles.actionCard} ${styles.actionCardPurple}`}
          onClick={() => navigate('/rag')}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/rag')}
        >
          <div className={`${styles.actionIcon} ${styles.actionIconPurple}`}>
            <Database size={20} />
          </div>
          <h3 className={styles.actionTitle}>RAG Workspace</h3>
          <p className={styles.actionDesc}>
            Test embedding models and vector similarity performance.
          </p>
        </div>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.instancesSection}>
          <h2 className={styles.sectionTitle}>Active Instances</h2>
          <div className={styles.tablePanel}>
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th>MODEL</th>
                  <th>STATUS</th>
                  <th>RAM/VRAM</th>
                  <th>Q-LEVEL</th>
                </tr>
              </thead>
              <tbody>
                <tr className={styles.tableRow}>
                  <td>
                    <div className={styles.modelCell}>
                      <Box size={16} color="var(--orbit-accent)" />
                      <span className={styles.modelName}>llama3:8b</span>
                    </div>
                  </td>
                  <td>
                    <div
                      className={`${styles.statusBadge} ${styles.statusLoaded}`}
                    >
                      <CheckCircle2 size={12} />
                      <span>Loaded</span>
                    </div>
                  </td>
                  <td className={styles.monoCell}>4.7 GB</td>
                  <td className={styles.monoCell}>Q4_0</td>
                </tr>
                <tr className={styles.tableRow}>
                  <td>
                    <div className={styles.modelCell}>
                      <Box size={16} color="var(--orbit-zinc-500)" />
                      <span
                        className={styles.modelName}
                        style={{ color: 'var(--orbit-zinc-400)' }}
                      >
                        mistral:7b-instruct
                      </span>
                    </div>
                  </td>
                  <td>
                    <div
                      className={`${styles.statusBadge} ${styles.statusIdle}`}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: 'var(--orbit-zinc-500)',
                        }}
                      />
                      <span>Idle</span>
                    </div>
                  </td>
                  <td className={styles.monoCellMuted}>-</td>
                  <td className={styles.monoCellMuted}>Q4_K_M</td>
                </tr>
                <tr className={styles.tableRow}>
                  <td>
                    <div className={styles.modelCell}>
                      <Box size={16} color="var(--orbit-cyan)" />
                      <span className={styles.modelName}>nomic-embed-text</span>
                    </div>
                  </td>
                  <td>
                    <div
                      className={`${styles.statusBadge} ${styles.statusLoaded}`}
                      style={{
                        color: 'var(--orbit-cyan)',
                        background: 'rgba(6, 182, 212, 0.1)',
                      }}
                    >
                      <CheckCircle2 size={12} />
                      <span>Loaded</span>
                    </div>
                  </td>
                  <td className={styles.monoCell}>0.8 GB</td>
                  <td className={styles.monoCell}>F16</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.experimentsSection}>
          <h2 className={styles.sectionTitle}>Recent Experiments</h2>
          <div className={styles.experimentList}>
            {RECENT_EXPERIMENTS.map((exp) => (
              <div key={exp.title} className={styles.experimentCard}>
                <div className={styles.experimentMeta}>
                  <span
                    className={`${styles.experimentType} ${exp.typeClass}`}
                  >
                    {exp.type}
                  </span>
                  <span className={styles.experimentTime}>{exp.time}</span>
                </div>
                <h4 className={styles.experimentTitle}>{exp.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
