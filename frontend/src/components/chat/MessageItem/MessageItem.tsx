import React from 'react';
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
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, compact = false }) => {
  const isUser = message.role === 'user';

  const content = (
    <>
        {isUser ? (
          <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
        ) : (
          <>
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
