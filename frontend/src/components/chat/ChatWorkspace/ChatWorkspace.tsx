import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Copy, RefreshCw, Sliders } from 'lucide-react';
import type { Conversation, ModelConfig } from '../../../types';
import type { ModelItem } from '../../../types';
import { ChatHistory } from '../ChatHistory/ChatHistory';
import { ModelPicker } from '../ModelPicker/ModelPicker';
import { ParamPanel } from '../ParamPanel/ParamPanel';
import { MessageItem } from '../MessageItem/MessageItem';
import { PromptSuggestions } from '../PromptSuggestions/PromptSuggestions';
import { OrbitMark } from '../../common/OrbitMark/OrbitMark';
import { MetricsBar } from '../../common/MetricsBar/MetricsBar';
import styles from './ChatWorkspace.module.css';

const SUGGESTIONS = [
  {
    title: 'Implement Quicksort',
    desc: 'Write a quicksort algorithm in Python with comments.',
    prompt:
      'Write a clean implementation of the quicksort algorithm in Python. Add explanations and comments to explain the sorting process.',
  },
  {
    title: 'Explain Quantum Computing',
    desc: 'Translate complex physics into simple terms.',
    prompt:
      'Explain quantum computing in simple terms that a high schooler would understand. Focus on qubits, superposition, and entanglement.',
  },
  {
    title: 'Refactor TypeScript code',
    desc: 'Improve readability and add types.',
    prompt:
      "How can I refactor this TypeScript code to make it more typed and clean?\n\n```typescript\nfunction logUser(user) {\n  console.log(user.name + ' is ' + user.age);\n}\n```",
  },
  {
    title: 'Draft Project Email',
    desc: 'A professional request for project status.',
    prompt:
      'Draft a professional but friendly email to a project partner asking for a status update on the integration phase.',
  },
];

export function ChatWorkspace({
  conversations,
  activeChatId,
  activeChat,
  inputValue,
  setInputValue,
  isLoading,
  onSendMessage,
  onSelectChat,
  onDeleteChat,
  onNewChat,
  models,
  selectedModel,
  setSelectedModel,
  config,
  setConfig,
}: {
  conversations: Conversation[];
  activeChatId: string | null;
  activeChat: Conversation | null;
  inputValue: string;
  setInputValue: (val: string) => void;
  isLoading: boolean;
  onSendMessage: (text?: string) => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (e: React.MouseEvent, id: string) => void;
  onNewChat: () => void;
  models: ModelItem[];
  selectedModel: string;
  setSelectedModel: (val: string) => void;
  config: ModelConfig;
  setConfig: React.Dispatch<React.SetStateAction<ModelConfig>>;
}) {
  const [showParams, setShowParams] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [activeChat?.messages, isLoading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [inputValue]);

  const hasMessages = activeChat && activeChat.messages.length > 0;

  return (
    <div className={styles.workspace}>
      <ChatHistory
        conversations={conversations}
        activeChatId={activeChatId}
        selectedModel={selectedModel}
        onSelect={onSelectChat}
        onNew={onNewChat}
        onDelete={onDeleteChat}
      />

      <div className={styles.main}>
        <div className={styles.toolbar}>
          <ModelPicker models={models} value={selectedModel} onChange={setSelectedModel} />
          <span className={styles.sessionHint}>session · local · streaming</span>
          <button
            type="button"
            onClick={() => setShowParams((s) => !s)}
            className={`${styles.configBtn} ${showParams ? styles.configBtnActive : styles.configBtnIdle}`}
          >
            <Sliders size={14} strokeWidth={1.75} />
            Config
          </button>
        </div>

        <div ref={scrollRef} className={styles.messages}>
          {!hasMessages ? (
            <div className={styles.emptyState}>
              <OrbitMark className={styles.emptyMark} />
              <h2 className={styles.emptyTitle}>Start a local session</h2>
              <p className={styles.emptyDesc}>
                Chat with any installed model. Every response is annotated with throughput and
                evaluation metrics so you can feel the difference.
              </p>
              <div className={styles.suggestionsWrap}>
                <PromptSuggestions
                  suggestions={SUGGESTIONS}
                  onSelect={(prompt) => onSendMessage(prompt)}
                />
              </div>
            </div>
          ) : (
            <div className={styles.messageList}>
              {activeChat!.messages.map((message, index) => {
                const isLastAssistant =
                  message.role === 'assistant' &&
                  index === activeChat!.messages.length - 1 &&
                  isLoading &&
                  !message.content;

                if (isLastAssistant) {
                  return (
                    <div key={index} className={styles.streamingRow}>
                      <div className={styles.avatar}>
                        <OrbitMark className={styles.avatarMark} />
                      </div>
                      <div className={styles.streamingBody}>
                        <span className={`${styles.streamingDot} orbit-blink`} />
                        <span className={styles.streamingText}>generating…</span>
                      </div>
                    </div>
                  );
                }

                if (message.role === 'user') {
                  return (
                    <div key={index} className={styles.userRow}>
                      <div className={styles.userBubble}>{message.content}</div>
                    </div>
                  );
                }

                return (
                  <div key={index} className={styles.assistantRow}>
                    <div className={styles.avatar}>
                      <OrbitMark className={styles.avatarMark} />
                    </div>
                    <div className={styles.assistantBody}>
                      <MessageItem message={message} compact />
                      <div className={styles.metricsBar}>
                        {message.metrics && (
                          <MetricsBar
                            tokensPerSec={message.metrics.tokens_per_sec}
                            totalTimeMs={message.metrics.ttft_ms * 1000}
                            tokenCount={message.metrics.eval_count}
                          />
                        )}
                        <div className={styles.metricActions}>
                          <button type="button" className={styles.iconBtn} aria-label="Copy">
                            <Copy size={14} strokeWidth={1.75} />
                          </button>
                          <button type="button" className={styles.iconBtn} aria-label="Regenerate">
                            <RefreshCw size={14} strokeWidth={1.75} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className={styles.composer}>
          <div className={styles.composerInner}>
            <div className={styles.inputBox}>
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    onSendMessage();
                  }
                }}
                rows={1}
                placeholder="Message the model…  (Enter to send, Shift+Enter for newline)"
                className={styles.textarea}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => onSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                className={styles.sendBtn}
                aria-label="Send"
              >
                <ArrowUp size={16} strokeWidth={2.25} />
              </button>
            </div>
            <p className={styles.composerHint}>
              Responses are generated locally · ORBIT does not send your data anywhere
            </p>
          </div>
        </div>
      </div>

      {showParams && <ParamPanel modelId={selectedModel} models={models} config={config} setConfig={setConfig} />}
    </div>
  );
}
