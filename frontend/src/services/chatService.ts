import type { Message, ModelConfig } from '../types';

const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';

export async function sendChatMessage(
  modelname: string,
  messages: Message[],
  onChunk?: (chunk: string) => void,
  config?: ModelConfig,
): Promise<{ text: string; metrics: any }> {

  // Sending to backend
  const body: Record<string, unknown> = {
    modelname: modelname,
    message: messages,
  };
  if (config) {
    body.config = config;
  }

  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Server returned status code: ${response.status}`);
  }


  // Recieving from backend
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Response body is not readable.');
  }

  const decoder = new TextDecoder();
  let fullResponse = '';
  let metrics: any = null;
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    
    // Keep the last partial line in the buffer
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const dataStr = line.slice(6);
        if (!dataStr.trim()) continue;
        
        try {
          const event = JSON.parse(dataStr);
          if (event.type === 'chunk') {
            fullResponse += event.text;
            onChunk?.(event.text);
          } else if (event.type === 'result') {
            metrics = event.metrics;
          }
        } catch (e) {
          console.error('Failed to parse SSE event', e);
        }
      }
    }
  }

  // Parse remaining buffer
  if (buffer.startsWith('data: ')) {
    try {
      const event = JSON.parse(buffer.slice(6));
      if (event.type === 'chunk') {
        fullResponse += event.text;
        onChunk?.(event.text);
      } else if (event.type === 'result') {
        metrics = event.metrics;
      }
    } catch (e) {
      // Ignore
    }
  }

  return { text: fullResponse || 'No response received.', metrics };
}
