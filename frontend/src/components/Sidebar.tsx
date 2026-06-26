import React from 'react';
import { Terminal, Plus, MessageSquare, Trash2 } from 'lucide-react';
import type { Conversation } from '../types';
import styles from './Sidebar.module.css';

interface SidebarProps {
  conversations: Conversation[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onDeleteChat: (e: React.MouseEvent, id: string) => void;
  onNewChat: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeChatId,
  onSelectChat,
  onDeleteChat,
  onNewChat,
}) => {
  return (
    <aside className={styles.sidebar}>

{/* This is Sidebar header */}

      <div className={styles.sidebarHeader}>
        <Terminal className={styles.logoIcon} />
        <span className={styles.logoText}>ORBIT</span>
      </div>

{/* This is Body */}

      <button className={styles.newChatBtn} onClick={onNewChat}>
        <Plus size={16} />
        New Chat
      </button>

      <div className={styles.chatHistoryList}>
        <div className={styles.historySectionTitle}>Recent Chats</div>
        {conversations.length === 0 ? (
          <div style={{ padding: '8px 12px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
            No recent chats
          </div>
        ) : (
          conversations.map((chat) => (
            <div
              key={chat.id}
              className={`${styles.historyItem} ${activeChatId === chat.id ? styles.active : ''}`}
            >
              <button
                type="button"
                className={styles.historySelectBtn}
                onClick={() => onSelectChat(chat.id)}
              >
                <MessageSquare size={14} style={{ flexShrink: 0 }} />
                <span className={styles.historyItemTitle}>{chat.title}</span>
              </button>
              <button
                type="button"
                className={styles.deleteHistoryBtn}
                onClick={(e) => onDeleteChat(e, chat.id)}
                title="Delete chat"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))
        )}
      </div>


{/* This is Sidebar Footer */}
      <div className={styles.sidebarFooter}>
        <div>ORBIT workspace</div>
        <div style={{ fontSize: '10.5px', opacity: 0.6 }}>Local-first AI Platform • v0.1.0</div>
      </div>
    </aside>
  );
};
