/**
 * Extracts <think>...</think> blocks from a streaming text chunk.
 *
 * Some models (like deepseek-r1) emit thinking inside <think></think> tags
 * directly in the content text rather than in a separate `thinking` field.
 * This utility normalises both cases.
 *
 * Usage:
 *   const { text, think } = extractThink(rawText, thinkBuf);
 *
 * The caller must maintain a mutable `thinkBuf` string across calls because
 * a <think> block may span many streaming chunks.
 *
 * State machine: we track whether we are currently inside a <think> block.
 */

export interface ThinkExtractResult {
  text: string;
  think: string;
  /** Pass this updated value back in on the next call */
  insideThink: boolean;
}

/**
 * Process a single streaming chunk.
 * @param raw          The raw text from the chunk (content field only — not the separate thinking field).
 * @param insideThink  Whether we are currently inside a <think> block from previous chunks.
 */
export function extractThinkChunk(
  raw: string,
  insideThink: boolean,
): ThinkExtractResult {
  let text = '';
  let think = '';
  let inside = insideThink;

  let remaining = raw;

  while (remaining.length > 0) {
    if (inside) {
      // Looking for closing </think>
      const closeIdx = remaining.indexOf('</think>');
      if (closeIdx === -1) {
        // entire remaining chunk is thinking
        think += remaining;
        remaining = '';
      } else {
        think += remaining.slice(0, closeIdx);
        inside = false;
        remaining = remaining.slice(closeIdx + 8); // skip </think>
      }
    } else {
      // Looking for opening <think>
      const openIdx = remaining.indexOf('<think>');
      if (openIdx === -1) {
        // entire remaining chunk is normal text
        text += remaining;
        remaining = '';
      } else {
        text += remaining.slice(0, openIdx);
        inside = true;
        remaining = remaining.slice(openIdx + 7); // skip <think>
      }
    }
  }

  return { text, think, insideThink: inside };
}
