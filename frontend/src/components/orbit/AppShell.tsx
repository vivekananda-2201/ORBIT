import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  MessageSquareText,
  Swords,
  User,
  Settings,
  Cpu,
  HardDrive,
  Activity,
  Command,
  CircleDot,
} from 'lucide-react';
import { OrbitMark } from './OrbitMark';
import styles from './AppShell.module.css';

const NAV = [
  { href: '/', label: 'Chat', icon: MessageSquareText },
  { href: '/arena', label: 'Arena', icon: Swords },
  { href: '/about', label: 'About', icon: User },
];

const ROUTE_META: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Chat', subtitle: 'Local inference workspace' },
  '/arena': { title: 'Model Arena', subtitle: 'Benchmark · compare · analyze' },
  '/about': { title: 'About', subtitle: 'Project · lab notes · contribute' },
};

function StatusChip({
  icon: Icon,
  label,
  value,
  tone = 'default',
}: {
  icon: typeof Cpu;
  label: string;
  value: string;
  tone?: 'default' | 'good';
}) {
  return (
    <div className={styles.statusChip}>
      <Icon
        size={14}
        strokeWidth={1.75}
        className={tone === 'good' ? styles.statusChipGood : undefined}
      />
      <span className={styles.statusLabel}>{label}</span>
      <span className={styles.statusValue}>{value}</span>
    </div>
  );
}

export function AppShell() {
  const { pathname } = useLocation();
  const meta = ROUTE_META[pathname] ?? ROUTE_META['/'];

  return (
    <div className={styles.shell}>
      <aside className={styles.rail}>
        <NavLink to="/" className={styles.logoLink}>
          <OrbitMark className={styles.logoMark} />
        </NavLink>

        <nav className={styles.nav}>
          {NAV.map((item) => {
            const active =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={`${styles.railLink} ${active ? styles.railLinkActive : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                {active && <span className={styles.railLinkActiveIndicator} />}
                <Icon size={20} strokeWidth={1.75} />
                <span className={styles.railLinkLabel}>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className={styles.railFooter}>
          <button type="button" className={styles.settingsBtn} aria-label="Settings">
            <Settings size={20} strokeWidth={1.75} />
          </button>
          <div className={styles.avatar}>VK</div>
        </div>
      </aside>

      <div className={styles.mainColumn}>
        <header className={styles.header}>
          <div className={styles.headerBrand}>
            <div className={styles.brandRow}>
              <span className={styles.brandName}>ORBIT</span>
              <span className={styles.brandLab}>Lab</span>
            </div>
            <span className={styles.separator}>/</span>
            <div className={styles.pageMeta}>
              <h1 className={styles.pageTitle}>{meta.title}</h1>
              <p className={styles.pageSubtitle}>{meta.subtitle}</p>
            </div>
          </div>

          <div className={styles.headerActions}>
            <StatusChip icon={CircleDot} label="Ollama" value="connected" tone="good" />
            <StatusChip icon={Cpu} label="GPU" value="64°C" />
            <StatusChip icon={HardDrive} label="VRAM" value="9.2/16GB" />
            <StatusChip icon={Activity} label="avg" value="62 tok/s" tone="good" />
            <button type="button" className={styles.commandBtn}>
              <Command size={14} strokeWidth={1.75} />
              <span className={styles.commandKey}>⌘K</span>
            </button>
          </div>
        </header>

        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
