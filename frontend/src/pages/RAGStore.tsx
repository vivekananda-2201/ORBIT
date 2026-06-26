import {
  Upload,
  FileText,
  Database,
  Link,
  Search,
  ArrowRight,
  Settings,
  CheckCircle2,
} from 'lucide-react';
import shared from '../styles/shared.module.css';
import styles from './RAGStore.module.css';

export function RAGStore() {
  return (
    <div className={shared.pageContainerWide}>
      <div>
        <h1 className={shared.pageTitle}>RAG Laboratory</h1>
        <p className={shared.pageSubtitle}>
          Design, test, and benchmark Retrieval-Augmented Generation pipelines.
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.stepPanel}>
          <div className={styles.stepHeader}>
            <div className={styles.stepNumber}>1</div>
            <h3 className={styles.stepTitle}>Knowledge Base</h3>
          </div>

          <div className={styles.dropZone}>
            <div className={styles.dropIcon}>
              <Upload size={20} />
            </div>
            <p className={styles.dropTitle}>Drop files to ingest</p>
            <p className={styles.dropHint}>PDF, TXT, MD, CSV</p>
          </div>

          <div>
            <h4 className={styles.sourcesLabel}>ACTIVE SOURCES</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className={styles.sourceItem}>
                <div className={styles.sourceInfo}>
                  <FileText size={16} color="var(--orbit-accent)" />
                  <div>
                    <p className={styles.sourceName}>System_Architecture.pdf</p>
                    <p className={styles.sourceMeta}>1.2 MB • 42 pages</p>
                  </div>
                </div>
                <CheckCircle2 size={16} color="var(--orbit-accent)" />
              </div>
              <div className={styles.sourceItem}>
                <div className={styles.sourceInfo}>
                  <Database size={16} color="#60a5fa" />
                  <div>
                    <p className={styles.sourceName}>Customer_Logs_Q3.csv</p>
                    <p className={styles.sourceMeta}>8.4 MB • 12k rows</p>
                  </div>
                </div>
                <CheckCircle2 size={16} color="var(--orbit-accent)" />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.stepPanel}>
          <div className={styles.stepHeader}>
            <div className={styles.stepNumber}>2</div>
            <h3 className={styles.stepTitle}>Embedding Config</h3>
          </div>

          <div>
            <label className={styles.label}>MODEL</label>
            <select className={styles.select} defaultValue="nomic">
              <option value="nomic">nomic-embed-text (Local)</option>
              <option value="mxbai">mxbai-embed-large (Local)</option>
              <option value="minilm">all-minilm (Local)</option>
            </select>
          </div>

          <div>
            <label className={styles.label}>CHUNKING STRATEGY</label>
            <div className={styles.strategyGrid}>
              <button type="button" className={`${styles.strategyBtn} ${styles.strategyBtnActive}`}>
                Recursive
              </button>
              <button type="button" className={styles.strategyBtn}>
                Token
              </button>
            </div>
          </div>

          <div className={styles.inputGrid}>
            <div>
              <label className={styles.label}>CHUNK SIZE</label>
              <input type="number" defaultValue={512} className={styles.numberInput} />
            </div>
            <div>
              <label className={styles.label}>OVERLAP</label>
              <input type="number" defaultValue={50} className={styles.numberInput} />
            </div>
          </div>

          <button type="button" className={styles.actionBtn}>
            <Link size={16} /> Generate Vector Store
          </button>
        </div>

        <div className={styles.stepPanelGlow}>
          <div className={styles.stepHeaderBetween}>
            <div className={styles.stepHeader} style={{ border: 'none', padding: 0 }}>
              <div className={`${styles.stepNumber} ${styles.stepNumberActive}`}>3</div>
              <h3 className={styles.stepTitleActive}>Test Retrieval</h3>
            </div>
            <Settings size={16} className={styles.settingsIcon} />
          </div>

          <div className={styles.searchWrapper}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Query the vector store..."
              defaultValue="What are the scaling limitations?"
            />
          </div>

          <div className={styles.resultsLabel}>
            <ArrowRight size={12} /> TOP 2 RESULTS (k=2)
          </div>

          <div className={styles.resultsList}>
            <div className={styles.resultCard}>
              <div className={styles.resultMeta}>
                <span className={styles.scoreBadge}>Score: 0.892</span>
                <span className={styles.resultSource}>
                  System_Architecture.pdf (Page 14)
                </span>
              </div>
              <p className={styles.resultText}>
                The primary scaling limitations observed during load testing relate
                to the concurrent connection handling of the database pool. When
                connections exceed 5,000 requests per second, the latency increases
                logarithmically rather than linearly.
              </p>
            </div>
            <div className={styles.resultCard}>
              <div className={styles.resultMeta}>
                <span className={styles.scoreBadge}>Score: 0.745</span>
                <span className={styles.resultSource}>
                  System_Architecture.pdf (Page 22)
                </span>
              </div>
              <p className={styles.resultText}>
                To mitigate scaling bottlenecks, a Redis caching layer was
                introduced between the API gateway and the primary storage array.
                This effectively reduced read-latency by 40%.
              </p>
            </div>
          </div>

          <button type="button" className={styles.passBtn}>
            Pass to LLM Context
          </button>
        </div>
      </div>
    </div>
  );
}
