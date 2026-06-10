ORBIT Chat Interface Documentation
===================================

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Backend Implementation](#backend-implementation)
5. [Frontend Implementation](#frontend-implementation)
6. [Streaming Response Protocol](#streaming-response-protocol)
7. [Setup and Deployment](#setup-and-deployment)
8. [API Reference](#api-reference)
9. [File Structure](#file-structure)
10. [Build and Validation](#build-and-validation)

## Overview

The ORBIT Chat Interface is a modern, local-first chat application built with React + TypeScript on the frontend and FastAPI on the backend. The system enables real-time streaming responses from a local language model (Ollama) with full session history management, markdown rendering, and a polished user experience.

**Key Characteristics:**
- Local-first architecture with no external API dependencies
- Streaming response protocol for real-time token display
- Session persistence using browser localStorage
- Responsive dark-themed UI with comprehensive markdown support
- Full error handling and connection diagnostics

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      React + TypeScript                      │
│                        (Frontend)                            │
│  • State Management (App.tsx)                               │
│  • Chat Components (ChatArea, MessageItem, etc.)            │
│  • Streaming Response Handler (chatService.ts)             │
└─────────────────────┬───────────────────────────────────────┘
                      │
           HTTP/1.1 Streaming
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    FastAPI Backend                           │
│                    (backend/api/chat.py)                     │
│  • CORS Middleware Configuration                            │
│  • Streaming Response Endpoint (/chat)                      │
│  • Request Validation (Pydantic)                            │
└─────────────────────┬───────────────────────────────────────┘
                      │
           Python Generator + Ollama
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    Ollama Local LLM                          │
│                    (qwen3.5:4b)                              │
│  • Token Generation Stream                                  │
│  • Context Window Management                                │
└─────────────────────────────────────────────────────────────┘
```

### Component Interaction

1. **Frontend sends request** → Chat history as JSON to `/chat` endpoint
2. **Backend receives request** → Validates message format via Pydantic schema
3. **Backend queries Ollama** → Streams tokens from language model
4. **Backend yields chunks** → FastAPI StreamingResponse sends text/plain chunks
5. **Frontend reads stream** → Incrementally renders tokens in real-time
6. **UI updates on each chunk** → Message content grows as tokens arrive
7. **Session persists** → Conversation saved to localStorage on each update

## Features

### Backend Features

- **CORS Middleware:** Configured to accept cross-origin requests from Vite development server (`http://localhost:5173`)
- **Main Server Entry Point:** Single command startup via `main.py` using uvicorn
- **Streaming Responses:** Ollama chat endpoint with `stream=True` for incremental token delivery
- **Request Validation:** Pydantic schemas ensure message format correctness
- **Error Handling:** Graceful error messages propagated to frontend

### Frontend Features

- **Sidebar History:** Create, delete, and switch between chat sessions
- **Local Persistence:** Session data persisted using browser `localStorage`
- **Welcome Screen:** Interactive suggestion cards for quick model testing
- **Auto-Growing Input:** Textarea dynamically resizes with content
- **Real-Time Streaming:** Assistant messages render token-by-token as they arrive
- **Markdown Support:** Full fenced code block rendering with syntax highlighting
- **Copy-to-Clipboard:** Code blocks include one-click copy functionality
- **Auto-Scroll:** Chat automatically scrolls to newest message
- **Typing Indicator:** Animated dots display while awaiting server response
- **Responsive Design:** Dark-themed UI optimized for desktop and tablet

## Backend Implementation

### Core Modules

#### `backend/api/chat.py`
FastAPI application with CORS and streaming endpoint:
```python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from backend.services.chat import generate_stream
from backend.schemas.chat import ChatRequest

app = FastAPI()
# CORS middleware configuration

@app.post("/chat")
def chat_with_model(request: ChatRequest):
    return StreamingResponse(generate_stream(request.message), media_type="text/plain")
```

#### `backend/services/chat.py`
Ollama integration with streaming support:
```python
def generate_stream(message):
    response = chat(
        model="qwen3.5:4b",
        messages=message,
        think=False,
        stream=True,
    )
    for chunk in response:
        content = chunk.get('message', {}).get('content', '')
        if content:
            yield content
```

#### `backend/schemas/chat.py`
Request validation schema:
```python
from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: list[dict]  # Full chat history with user and assistant messages
```

### Request Format

All requests to `/chat` expect:
```json
{
  "message": [
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Hi there!"},
    {"role": "user", "content": "How are you?"}
  ]
}
```

## Frontend Implementation

### Core Modules

#### `frontend/src/App.tsx`
Main application state machine managing conversations and message flow:
- Conversation CRUD operations (create, read, update, delete)
- Message history with localStorage synchronization
- Streaming message update on each chunk arrival
- Error state management with detailed diagnostics

#### `frontend/src/services/chatService.ts`
HTTP client with streaming support:
```typescript
export async function sendChatMessage(
  messages: Message[],
  onChunk?: (chunk: string) => void,
): Promise<string>
```
Reads response body incrementally using `ReadableStream` API and invokes callback for each chunk.

#### `frontend/src/components/`
- **ChatArea.tsx:** Main message display and input container
- **MessageItem.tsx:** Individual message renderer with role-specific styling
- **CodeBlock.tsx:** Syntax-highlighted code block with copy button
- **Sidebar.tsx:** Session history and navigation
- **PromptSuggestions.tsx:** Initial welcome suggestions

#### `frontend/src/types/index.ts`
TypeScript interfaces:
```typescript
export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}
```

## Streaming Response Protocol

### How Streaming Works

1. **Frontend initiates request** with full message history
2. **Backend validates request** and begins Ollama stream
3. **Backend yields text chunks** via Python generator
4. **FastAPI wraps generator** in `StreamingResponse(media_type="text/plain")`
5. **Frontend's `ReadableStream` reader** consumes chunks as available
6. **UI updates immediately** for each chunk (no waiting for full response)
7. **Callback (`onChunk`)** allows real-time message rendering

### Response Stream Format

Plain text chunks streamed as server generates them. No JSON framing; raw UTF-8 text.

Example stream sequence:
```
"Hello" → " there" → "!" → " How" → " can" → " I" → " help" → "?"
```

Each chunk renders immediately in the UI.

## Setup and Deployment

### Prerequisites

- Python 3.10+ with pip
- Node.js 18+ with npm
- Ollama with `qwen3.5:4b` model downloaded
- Virtual environment (recommended)

### Installation

1. **Backend Setup**
```bash
cd /path/to/ORBIT
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install fastapi uvicorn ollama pydantic
```

2. **Frontend Setup**
```bash
cd frontend
npm install
```

### Running the Application

**Terminal 1 (Backend):**
```bash
.venv/bin/python main.py
```
Backend runs on `http://127.0.0.1:5000`

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

### Production Build

Frontend production bundle:
```bash
cd frontend
npm run build
```

Output in `frontend/dist/`. Serve with any static HTTP server.

## API Reference

### POST `/chat`

**Description:** Send a message and receive a streaming response from the language model.

**Request Body:**
```json
{
  "message": [
    {"role": "user", "content": "string"},
    {"role": "assistant", "content": "string"}
  ]
}
```

**Response:**
- **Content-Type:** `text/plain`
- **Body:** Streamed text chunks (UTF-8)
- **Status:** 200 OK on success, 422 Unprocessable Entity on validation failure

**Example Usage (JavaScript):**
```typescript
const response = await fetch('http://127.0.0.1:5000/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: [{ role: 'user', content: 'Hello' }]
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  console.log(decoder.decode(value, { stream: true }));
}
```

## File Structure

```
ORBIT/
├── main.py                           # Server entry point
├── rough.py                          # Streaming prototype reference
├── README.md                         # Project overview
├── ChatInterface.md                  # This documentation
│
├── backend/
│   ├── api/
│   │   └── chat.py                  # FastAPI app and /chat endpoint
│   ├── schemas/
│   │   └── chat.py                  # Pydantic ChatRequest schema
│   └── services/
│       └── chat.py                  # Ollama integration with streaming
│
└── frontend/
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    ├── index.html
    ├── src/
    │   ├── main.tsx                 # React entry point
    │   ├── App.tsx                  # Main state machine
    │   ├── App.css
    │   ├── index.css                # Dark theme + animations
    │   ├── components/
    │   │   ├── ChatArea.tsx
    │   │   ├── CodeBlock.tsx
    │   │   ├── MessageItem.tsx
    │   │   ├── PromptSuggestions.tsx
    │   │   └── Sidebar.tsx
    │   ├── services/
    │   │   └── chatService.ts       # HTTP client with streaming
    │   └── types/
    │       └── index.ts             # TypeScript interfaces
    └── public/
```

## Build and Validation

### Frontend Build Status

The React + TypeScript frontend compiles successfully with zero errors.

**Build Output:**
```bash
$ npm run build
vite v8.0.16 building client environment for production...
✓ 1904 modules transformed.
dist/index.html                   0.45 kB │ gzip:  0.29 kB
dist/assets/index-BLT5Bnlf.css   14.77 kB │ gzip:  3.44 kB
dist/assets/index-DLemNZ4Z.js   319.10 kB │ gzip: 99.57 kB

✓ built in 256ms
```

### Backend Validation

All Python modules compile without errors:
```bash
$ python -m compileall backend main.py
Listing 'backend'...
Listing 'backend/api'...
Listing 'backend/schemas'...
Listing 'backend/services'...
Compiling 'main.py'...
```

---

**Last Updated:** June 2026  
**Status:** Production Ready

