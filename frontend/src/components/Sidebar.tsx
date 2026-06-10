import React from 'react';
import { Terminal, Plus, MessageSquare, Trash2 } from 'lucide-react';
import type { Conversation } from '../types';

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
    <aside className="sidebar">
      <div className="sidebar-header">
        <Terminal className="logo-icon" />
        <span className="logo-text">ORBIT</span>
      </div>

      <button className="new-chat-btn" onClick={onNewChat}>
        <Plus size={16} />
        New Chat
      </button>

      <div className="chat-history-list">
        <div className="history-section-title">Recent Chats</div>
        {conversations.length === 0 ? (
          <div style={{ padding: '8px 12px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
            No recent chats
          </div>
        ) : (
          conversations.map((chat) => (
            <button
              key={chat.id}
              className={`history-item ${activeChatId === chat.id ? 'active' : ''}`}
              onClick={() => onSelectChat(chat.id)}
            >
              <MessageSquare size={14} style={{ flexShrink: 0 }} />
              <span className="history-item-title">{chat.title}</span>
              <button
                className="delete-history-btn"
                onClick={(e) => onDeleteChat(e, chat.id)}
                title="Delete chat"
              >
                <Trash2 size={13} />
              </button>
            </button>
          ))
        )}
      </div>

      <div className="sidebar-footer">
        <div>ORBIT workspace</div>
        <div style={{ fontSize: '10.5px', opacity: 0.6 }}>Local-first AI Platform • v0.1.0</div>
      </div>
    </aside>
  );
};
