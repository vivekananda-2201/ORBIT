import type { Message } from '../types';

const API_BASE_URL = 'http://127.0.0.1:5000';

export async function sendChatMessage(
  messages: Message[],
  onChunk?: (chunk: string) => void,
): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: messages,
    }),
  });

  if (!response.ok) {
    throw new Error(`Server returned status code: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Response body is not readable.');
  }

  const decoder = new TextDecoder();
  let fullResponse = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    if (chunk) {
      fullResponse += chunk;
      onChunk?.(chunk);
    }
  }

  const finalChunk = decoder.decode();
  if (finalChunk) {
    fullResponse += finalChunk;
    onChunk?.(finalChunk);
  }

  return fullResponse || 'No response received.';
}
