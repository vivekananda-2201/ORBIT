import { useState } from 'react';
import { Plus, Search, MessageSquare, Trash2 } from 'lucide-react';
import type { Conversation } from '../../../types';
import styles from './ChatHistory.module.css';

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

export function ChatHistory({
  conversations,
  activeChatId,
  selectedModel,
  onSelect,
  onNew,
  onDelete,
}: {
  conversations: Conversation[];
  activeChatId: string | null;
  selectedModel: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
}) {
  const [query, setQuery] = useState('');

  const chats = conversations.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <button type="button" className={styles.newBtn} onClick={onNew}>
          <Plus size={16} strokeWidth={2} />
          New session
        </button>
        <div className={styles.searchWrap}>
          <Search size={14} className={styles.searchIcon} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sessions"
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.list}>
        <div className={styles.section}>
          <p className={styles.sectionLabel}>Recent</p>
          <div className={styles.sectionItems}>
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`${styles.row} ${activeChatId === chat.id ? styles.rowActive : ''}`}
                onClick={() => onSelect(chat.id)}
                onKeyDown={(e) => e.key === 'Enter' && onSelect(chat.id)}
                role="button"
                tabIndex={0}
              >
                <MessageSquare size={14} style={{ flexShrink: 0, color: 'var(--muted-foreground)' }} />
                <div className={styles.rowContent}>
                  <p className={styles.rowTitle}>{chat.title}</p>
                  <div className={styles.rowMeta}>
                    <span className={styles.rowMetaDot} />
                    <span>{selectedModel || 'local'}</span>
                    <span>·</span>
                    <span>{formatRelativeTime(chat.createdAt)}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.deleteBtn}
                  onClick={(e) => onDelete(e, chat.id)}
                  aria-label="Delete session"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {chats.length === 0 && (
              <p className={styles.empty}>No sessions found</p>
            )}
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.footerRow}>
          <span>Stored locally</span>
          <span className={styles.footerCount}>{chats.length} sessions</span>
        </div>
      </div>
    </div>
  );
}
