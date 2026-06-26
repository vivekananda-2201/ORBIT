import React, { useEffect, useRef } from 'react';
import { Cpu, Plus, Sparkles, Info, Send } from 'lucide-react';

// Types and Schemas
import type { Conversation } from '../types';
import type { ModelItem } from '../types/';

// Props and Components
import { MessageItem } from './MessageItem';
import { PromptSuggestions } from './PromptSuggestions';
import styles from './ChatArea.module.css';

interface Suggestion {
  title: string;
  desc: string;
  prompt: string;
}

const SUGGESTIONS: Suggestion[] = [
  {
    title: "Implement Quicksort",
    desc: "Write a quicksort algorithm in Python with comments.",
    prompt: "Write a clean implementation of the quicksort algorithm in Python. Add explanations and comments to explain the sorting process."
  },
  {
    title: "Explain Quantum Computing",
    desc: "Translate complex physics into simple terms.",
    prompt: "Explain quantum computing in simple terms that a high schooler would understand. Focus on qubits, superposition, and entanglement."
  },
  {
    title: "Refactor TypeScript code",
    desc: "Improve readability and add types.",
    prompt: "How can I refactor this TypeScript code to make it more typed and clean?\n\n```typescript\nfunction logUser(user) {\n  console.log(user.name + ' is ' + user.age);\n}\n```"
  },
  {
    title: "Draft Project Email",
    desc: "A professional request for project status.",
    prompt: "Draft a professional but friendly email to a project partner asking for a status update on the integration phase."
  }
];

interface ChatAreaProps {
  activeChat: Conversation | null;
  inputValue: string;
  setInputValue: (val: string) => void;
  isLoading: boolean;
  onSendMessage: (textToSend?: string) => void;
  onNewChat: () => void;
  models: ModelItem[];
  selectedModel: string;
  setSelectedModel: (val: string) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  activeChat,
  inputValue,
  setInputValue,
  isLoading,
  onSendMessage,
  onNewChat,
  models,
  selectedModel,
  setSelectedModel,

}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of messages container
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages, isLoading]);

  // Handle textarea autosize
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [inputValue]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <main className={styles.chatArea}>
      {/* Header */}
      <header className={styles.chatHeader}>
        <div className={styles.chatHeaderInfo}>
          <span className={styles.chatHeaderTitle}>
            {activeChat ? activeChat.title : "New Chat"}
          </span>
          <span className={styles.chatHeaderSubtitle}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Cpu size={12} /> Model:
              <select 
                className={styles.modelSelect}
                value={selectedModel} 
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                {models.map((item, index) => (
                  <option key={index} value={item.model}>{item.model}</option>
                ))}
              </select>
            </span>
          </span>
        </div>

        <div className={styles.chatHeaderActions}>
          <button className={styles.iconBtn} onClick={onNewChat} title="New Chat">
            <Plus size={16} />
          </button>
        </div>
      </header>

      {/* Messages Feed */}
      <div className={styles.chatMessagesContainer}>
        {!activeChat || activeChat.messages.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIconWrapper}>
              <Sparkles size={32} />
            </div>
            <h1>Welcome to ORBIT</h1>
            <p>
              An Operational Research and Benchmarking Interface for Transformers. 
              Interact with your locally running language models instantly and securely.
            </p>
            
            <PromptSuggestions suggestions={SUGGESTIONS} onSelect={onSendMessage} />
          </div>
        ) : (
          <>
            {activeChat.messages.map((msg, index) => (
              <MessageItem key={index} message={msg} />
            ))}
            
            {/* Typing indicator */}
            {isLoading && (
              <div className={`${styles.messageWrapper} ${styles.assistant}`}>
                <div className={styles.messageBubble}>
                  <div className={styles.typingIndicator}>
                    <div className={styles.typingDot}></div>
                    <div className={styles.typingDot}></div>
                    <div className={styles.typingDot}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Bar */}
      <div className={styles.chatInputContainer}>
        <div className={styles.inputFormWrapper}>
          <textarea
            ref={textareaRef}
            className={styles.textareaInput}
            rows={1}
            placeholder="Ask anything or choose a prompt..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          
          <div className={styles.inputActions}>
            <div className={styles.inputInfoHint}>
              <Info size={11} />
              <span>Enter to send, Shift+Enter for new line</span>
            </div>
            
            <button 
              className={styles.sendBtn}
              onClick={() => onSendMessage()}
              disabled={isLoading || !inputValue.trim()}
              title="Send Message"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
