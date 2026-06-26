import React from 'react';
import { Sparkles } from 'lucide-react';
import styles from './PromptSuggestions.module.css';

interface Suggestion {
  title: string;
  desc: string;
  prompt: string;
}

interface PromptSuggestionsProps {
  suggestions: Suggestion[];
  onSelect: (prompt: string) => void;
}

export const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ suggestions, onSelect }) => {
  return (
    <div className={styles.promptSuggestionsGrid}>
      {suggestions.map((s) => (
        <button
          key={s.prompt}
          type="button"
          className={styles.suggestionCard}
          onClick={() => onSelect(s.prompt)}
        >
          <span className={styles.suggestionTitle}>
            <Sparkles size={14} color="var(--primary)" />
            {s.title}
          </span>
          <span className={styles.suggestionDesc}>{s.desc}</span>
        </button>
      ))}
    </div>
  );
};
