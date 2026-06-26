import type { ModelConfig, ArenaModelResult } from '../types';

const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';

export interface ArenaCallbacks {
  onModelStart: (model: string) => void;
  onModelChunk?: (model: string, text: string) => void;
  onModelResult: (model: string, data: ArenaModelResult) => void;
  onModelError: (model: string, message: string) => void;
  onComplete: () => void;
}

export async function runArena(
  prompt: string,
  models: string[],
  callbacks: ArenaCallbacks,
  config?: ModelConfig,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/arena/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      models: models.slice(0, 6),
      config: config ?? null,
    }),
  });

  if (!response.ok) {
    throw new Error(`Arena API returned status ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Response body is not readable.');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split('\n\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data: ')) continue;

      const jsonStr = trimmed.slice(6);
      try {
        const event = JSON.parse(jsonStr);

        switch (event.type) {
          case 'start':
            callbacks.onModelStart(event.model);
            break;
          case 'chunk':
            callbacks.onModelChunk?.(event.model, event.text);
            break;
          case 'result':
            callbacks.onModelResult(event.model, event.data as ArenaModelResult);
            break;
          case 'error':
            callbacks.onModelError(event.model, event.message);
            break;
          case 'complete':
            callbacks.onComplete();
            break;
        }
      } catch {
        // Skip malformed JSON
      }
    }
  }

  // Process any remaining data in buffer
  const remaining = buffer.trim();
  if (remaining.startsWith('data: ')) {
    try {
      const event = JSON.parse(remaining.slice(6));
      if (event.type === 'complete') {
        callbacks.onComplete();
      }
    } catch {
      // ignore
    }
  }
}
