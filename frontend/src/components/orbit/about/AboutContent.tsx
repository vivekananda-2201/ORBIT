import { useState } from 'react';
import {
  Star,
  Send,
  Mail,
  ArrowUpRight,
  GitPullRequest,
  Lightbulb,
  Bug,
  Cpu,
  Lock,
  Boxes,
  LineChart,
  Check,
} from 'lucide-react';
import { OrbitMark } from '../OrbitMark';
import styles from './AboutContent.module.css';

const PILLARS = [
  {
    icon: Lock,
    title: 'Local-first',
    body: 'Every token is generated on your machine through Ollama. Nothing leaves your device.',
  },
  {
    icon: Boxes,
    title: 'Model-agnostic',
    body: 'Swap, stack and compare any installed model without touching a config file.',
  },
  {
    icon: LineChart,
    title: 'Measured by default',
    body: 'Throughput, latency and quality are first-class — not an afterthought.',
  },
  {
    icon: Cpu,
    title: 'No code required',
    body: 'Run real experiments through a UI instead of writing throwaway scripts.',
  },
];

const POSTS = [
  {
    tag: 'Engineering',
    date: 'Apr 24, 2026',
    title: 'Why ORBIT measures eval duration per response',
    excerpt:
      'Token throughput alone hides the cold-start cost. Here is how ORBIT separates time-to-first-token from steady-state generation.',
    read: '6 min',
  },
  {
    tag: 'Research',
    date: 'Apr 11, 2026',
    title: 'Comparing 4 quantizations of Llama 3.1 8B',
    excerpt:
      'Q4_K_M vs Q5_K_M vs Q8_0 vs FP16 — a local benchmark of speed and answer quality across a fixed prompt set.',
    read: '9 min',
  },
  {
    tag: 'Product',
    date: 'Mar 30, 2026',
    title: 'Designing the Arena: 4 models, one prompt',
    excerpt:
      'The story behind side-by-side columns and the HUD that turns raw runs into a verdict you can act on.',
    read: '4 min',
  },
];

const CONTRIB = [
  { icon: Lightbulb, label: 'Feature request', desc: 'Suggest something ORBIT should do' },
  { icon: Bug, label: 'Bug report', desc: 'Tell me what broke' },
  { icon: GitPullRequest, label: 'Pull request', desc: 'Open a PR on the repo' },
];

export function AboutContent() {
  const [active, setActive] = useState(0);
  const [sent, setSent] = useState(false);

  return (
    <div className={styles.page}>
      <section className={`${styles.hero} orbit-grid`}>
        <div className={styles.heroInner}>
          <div className={`${styles.heroIcon} orbit-glow`}>
            <OrbitMark className={styles.heroMark} />
          </div>
          <p className={styles.heroTag}>
            Operational Research &amp; Benchmarking Interface for Transformers
          </p>
          <h1 className={styles.heroTitle}>A local-first laboratory for AI experimentation</h1>
          <p className={styles.heroDesc}>
            ORBIT is a personal project built to stop wasting time on glue code. Instead of
            writing custom scripts to test a model, you chat, compare, benchmark and analyze
            inside one unified workbench — all running on your own hardware.
          </p>
          <div className={styles.heroActions}>
            <button type="button" className={styles.btnPrimary}>
              <Star size={16} />
              Star on GitHub
            </button>
            <button type="button" className={styles.btnSecondary}>
              Read the docs
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <div className={styles.content}>
        <section>
          <p className={styles.sectionLabel}>Philosophy</p>
          <div className={styles.pillarGrid}>
            {PILLARS.map((p) => (
              <div key={p.title} className={styles.pillarCard}>
                <div className={styles.pillarIcon}>
                  <p.icon size={16} strokeWidth={1.75} />
                </div>
                <h3 className={styles.pillarTitle}>{p.title}</h3>
                <p className={styles.pillarBody}>{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className={styles.blogHeader}>
            <p className={styles.sectionLabel}>Lab notes</p>
            <button type="button" className={styles.blogLink}>
              All posts <ArrowUpRight size={14} />
            </button>
          </div>
          <div className={styles.postGrid}>
            {POSTS.map((post) => (
              <article key={post.title} className={styles.postCard}>
                <div className={styles.postMeta}>
                  <span className={styles.postTag}>{post.tag}</span>
                  <span>·</span>
                  <span>{post.date}</span>
                </div>
                <h3 className={styles.postTitle}>{post.title}</h3>
                <p className={styles.postExcerpt}>{post.excerpt}</p>
                <div className={styles.postFooter}>
                  <span>{post.read} read</span>
                  <ArrowUpRight size={16} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.contribGrid}>
          <div>
            <p className={styles.sectionLabel}>Contribute</p>
            <h2 className={styles.contribTitle}>Help shape ORBIT</h2>
            <p className={styles.contribDesc}>
              ORBIT is open and evolving. Pick a lane below or send a note directly — feature
              ideas, benchmarks you want built in, or rough edges you hit.
            </p>
            <div className={styles.contribList}>
              {CONTRIB.map((c, i) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`${styles.contribItem} ${active === i ? styles.contribItemActive : ''}`}
                >
                  <div className={styles.pillarIcon}>
                    <c.icon size={16} strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className={styles.contribItemTitle}>{c.label}</p>
                    <p className={styles.contribItemDesc}>{c.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formCard}>
            <h3 className={styles.formTitle}>{CONTRIB[active].label}</h3>
            <p className={styles.formDesc}>{CONTRIB[active].desc}</p>
            <div className={styles.formFields}>
              <label>
                <span className={styles.fieldLabel}>Name</span>
                <input className={styles.fieldInput} placeholder="Ada Lovelace" />
              </label>
              <label>
                <span className={styles.fieldLabel}>Email</span>
                <input className={styles.fieldInput} placeholder="you@example.com" />
              </label>
              <label>
                <span className={styles.fieldLabel}>Message</span>
                <textarea
                  rows={4}
                  className={`${styles.fieldInput} ${styles.fieldTextarea}`}
                  placeholder={`Describe your ${CONTRIB[active].label.toLowerCase()}…`}
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  setSent(true);
                  setTimeout(() => setSent(false), 2200);
                }}
                className={styles.btnPrimary}
                style={{ justifyContent: 'center' }}
              >
                {sent ? (
                  <>
                    <Check size={16} /> Sent
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </div>
        </section>

        <section className={styles.footer}>
          <div className={styles.creator}>
            <div className={styles.creatorAvatar}>VK</div>
            <div>
              <p className={styles.creatorName}>Built by VK</p>
              <p className={styles.creatorSub}>ORBIT · a local-first AI workbench</p>
            </div>
          </div>
          <div className={styles.socialRow}>
            <button type="button" className={styles.socialBtn} aria-label="Send">
              <Send size={16} strokeWidth={1.75} />
            </button>
            <button type="button" className={styles.socialBtn} aria-label="Email">
              <Mail size={16} strokeWidth={1.75} />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
