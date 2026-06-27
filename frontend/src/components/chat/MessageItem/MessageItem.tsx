import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { CodeBlock } from '../CodeBlock/CodeBlock';
import type { Message } from '../../../types';
import styles from './MessageItem.module.css';

interface MessageItemProps {
  message: Message;
  compact?: boolean;
  isStreaming?: boolean;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, compact = false, isStreaming = false }) => {
  const isUser = message.role === 'user';
  const [thinkOpen, setThinkOpen] = useState(true);

  // Count thinking chunks — approximate 1 chunk ≈ 1 token for real-time display
  const thinkChunkCount = message.think
    ? message.think.split(/\s+/).filter(Boolean).length
    : 0;

  // While streaming thinking and no content yet, always show the think box open
  const isActivelyThinking = isStreaming && !!message.think && !message.content;

  const content = (
    <>
        {isUser ? (
          <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
        ) : (
          <>
            {message.think && (
              <div className={`${styles.thinkBox} ${isActivelyThinking ? styles.thinkBoxActive : ''}`}>
                <button
                  type="button"
                  className={styles.thinkSummary}
                  onClick={() => setThinkOpen((o) => !o)}
                  aria-expanded={thinkOpen}
                >
                  <span className={styles.thinkIcon}>🧠</span>
                  {isActivelyThinking ? 'Thinking…' : 'Thought Process'}
                  <span className={`${styles.thinkTokens} ${isActivelyThinking ? styles.thinkTokensActive : ''}`}>
                    {thinkChunkCount} tokens
                  </span>
                  <span className={styles.thinkChevron}>
                    {thinkOpen ? '▾' : '▸'}
                  </span>
                </button>
                {thinkOpen && (
                  <div className={styles.thinkContent}>
                    <ReactMarkdown
                      remarkPlugins={[remarkMath, remarkGfm]}
                      rehypePlugins={[rehypeKatex]}
                    >
                      {message.think}
                    </ReactMarkdown>
                    {isActivelyThinking && (
                      <span className={`${styles.thinkCursor} orbit-blink`} />
                    )}
                  </div>
                )}
              </div>
            )}
            <ReactMarkdown
              remarkPlugins={[remarkMath, remarkGfm]}
              rehypePlugins={[rehypeKatex]}
              components={{
                // Strip default <pre> wrapper — CodeBlock handles its own container
                pre({ children }) {
                  return <>{children}</>;
                },
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const language = match ? match[1] : '';
                  const codeContent = String(children).replace(/\n$/, '');
                  const isInline = !className && !codeContent.includes('\n');

                  if (!isInline) {
                    return (
                      <CodeBlock
                        code={codeContent}
                        language={language || 'text'}
                      />
                    );
                  }

                  return (
                    <code className={styles.inlineCode} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </>
        )}
    </>
  );

  if (compact && !isUser) {
    return <div className={styles.compactContent}>{content}</div>;
  }

  return (
    <div className={`${styles.messageWrapper} ${styles[message.role]}`}>
      <div className={styles.messageBubble}>{content}</div>
    </div>
  );
};
