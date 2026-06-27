# Chat Interface Technical Documentation

This document outlines the architecture, data flow, and implementation details of the ORBIT Lab Chat Interface.

---

## 🏗️ Architecture Overview

The Chat Interface is built on a decoupled client-server architecture:

1. **Frontend**: React-based UI that handles state persistence (`localStorage`), markdown rendering, and Server-Sent Events (SSE) stream parsing.
2. **Backend**: FastAPI router that proxies requests to the local Ollama daemon via the official Python client.
3. **Core Utility**: A shared `llm.py` streaming utility that unifies SSE streaming and metrics extraction for both Chat and Arena modules.

---

## 🔀 Data Flow (SSE Streaming)

The Chat relies on Server-Sent Events to render responses character-by-character and extract native Ollama timing metrics.

1. **User Input**: The user types a message and clicks send.
2. **Frontend Request**: `sendChatMessage()` (`chatService.ts`) serializes the conversation history and model configurations (temperature, context window, system prompt) and posts it to the backend.
3. **Backend Processing**: 
   - `chat/router.py` receives the request.
   - `llm.py` prepends the `system_prompt` (if provided) and initiates a streaming request to Ollama.
   - `llm.py` yields `{"type": "chunk", "text": "..."}` as the model generates text.
   - Once generation finishes, `llm.py` extracts Ollama's native telemetry (e.g. `eval_count`, `prompt_eval_duration`) and yields a final `{"type": "result", "metrics": {...}}` packet.
4. **Frontend Rendering**:
   - `chatService.ts` parses the incoming SSE lines.
   - Each `chunk` triggers a React state update, instantly rendering markdown via `<ReactMarkdown>`.
   - The final `result` attaches performance metrics (Tokens/sec, TTFT) to the bottom of the chat bubble.

---

## 💾 State Persistence (Keep-Alive)

To ensure users never lose work during a benchmark or while navigating the app, ORBIT uses a **Keep-Alive Architecture**.

### 1. CSS-based Routing
Unlike standard React applications that use `<Outlet />` to completely mount and unmount page components, ORBIT renders the `ChatPage`, `ArenaPage`, and `AboutPage` simultaneously within `AppShell.tsx`. It uses `display: none` tied to the router's `useLocation()` to hide inactive tabs. This ensures that a streaming request will never be aborted simply because the user switched tabs.

### 2. LocalStorage Sync
React `useEffect` hooks constantly sync the `activeChatId`, input drafts, and configurations to `localStorage`. If the user accidentally refreshes the browser, the exact state of the workspace is instantly restored.

---

## ⚙️ Model Configurations

The `ParamPanel` component allows users to dynamically override generation parameters.

- **System Prompt**: Pre-injected at the top of the conversation array on the backend to instruct model behavior.
- **Think Mode (Chain of Thought)**: If supported by the model, passing `think=true` instructs Ollama to yield `<think>` blocks. `llm.py` natively separates these reasoning chunks from standard text, allowing the frontend to render a dedicated, expandable "Thought Process" UI box above the final response, complete with a dynamic reasoning token count.
- **Temperature**: Controls generation randomness (higher = more creative).
- **Top P**: Nucleus sampling cutoff.
- **Context Window (`num_ctx`)**: Defines the maximum token memory of the model before it drops older messages.
- **Max Tokens (`num_predict`)**: Caps the maximum length of a single generation.

---

## 🛑 Stop Generation
The chat interface implements an `AbortController` in `chatService.ts` that triggers when the user presses the "Stop" button during a stream. This gracefully terminates the SSE connection and leaves the partial response exactly as generated, allowing the user to seamlessly resume or modify their prompt.
