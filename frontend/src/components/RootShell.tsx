import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router';
import {
  Activity,
  Cpu,
  Layers,
  Network,
  Settings,
  MessageSquare,
  TerminalSquare,
  Zap,
  Database,
  Search,
  Command,
} from 'lucide-react';
import styles from './RootShell.module.css';

function NavItem({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
      }
    >
      {icon}
      <span className={styles.tooltip}>{label}</span>
    </NavLink>
  );
}

export function RootShell() {
  const location = useLocation();
  const isChatRoute = location.pathname === '/chat';

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logo}>
            <Network className={styles.logoIcon} />
            <span className={styles.emeraldText}>ORBIT</span>
          </div>
          <span className={styles.version}>v0.9.4-beta</span>
        </div>

        <div className={styles.headerCenter}>
          <button type="button" className={styles.commandBtn}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Search style={{ width: 12, height: 12 }} />
              <span>Global Command...</span>
            </span>
            <span className={styles.commandShortcut}>
              <Command style={{ width: 12, height: 12 }} />
              <span>K</span>
            </span>
          </button>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.statusItem}>
            <Activity className={styles.statusIconEmerald} />
            <span>Ollama: Online</span>
          </div>
          <div className={styles.statusItem}>
            <Cpu className={styles.statusIconCyan} />
            <span>GPU: 42°C</span>
          </div>
          <div className={styles.statusItem}>
            <Zap className={styles.statusIconPurple} />
            <span>RAM: 14.2GB / 32GB</span>
          </div>
        </div>
      </header>

      <div className={styles.workspace}>
        <div className={styles.dock}>
          <nav className={styles.nav}>
            <NavItem to="/" icon={<TerminalSquare />} label="Workspace" />
            <NavItem to="/chat" icon={<MessageSquare />} label="Chat" />
            <NavItem to="/benchmarks" icon={<Activity />} label="Metrics" />
            <NavItem to="/rag" icon={<Database />} label="RAG Lab" />
            <NavItem to="/agents" icon={<Layers />} label="Agents" />
          </nav>

          <div className={styles.dockFooter}>
            <NavItem to="/settings" icon={<Settings />} label="Config" />
            <div className={styles.avatar}>
              <div className={styles.avatarInner}>ME</div>
            </div>
          </div>
        </div>

        <main className={styles.main}>
          <div className={styles.gradientOverlay} />
          <div
            className={`${styles.content} ${isChatRoute ? styles.contentFullBleed : ''}`}
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
