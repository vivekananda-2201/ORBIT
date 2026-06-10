import React from 'react';

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
    <div className="prompt-suggestions-grid">
      {suggestions.map((s, i) => (
        <button
          key={i}
          className="suggestion-card"
          onClick={() => onSelect(s.prompt)}
        >
          <span className="suggestion-title">{s.title}</span>
          <span className="suggestion-desc">{s.desc}</span>
        </button>
      ))}
    </div>
  );
};
