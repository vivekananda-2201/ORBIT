# Arena Benchmark Documentation

The Arena module is designed to safely and effectively benchmark up to 6 local Ollama models simultaneously.

---

## 🏗️ Architecture Overview

To prevent hardware throttling and OOM (Out-Of-Memory) crashes, the Arena benchmarks models **sequentially** rather than parallelizing the backend requests.

1. **Frontend Queue**: `ArenaWorkspace.tsx` manages a React `useState` queue of up to 6 `slots`.
2. **Sequential Dispatch**: `ArenaBenchmark.tsx` iteratively loops through the configured models, initiating a streaming `fetch` request for one model only when the previous one finishes.
3. **SSE Streams**: Each request hooks into the backend's `llm.py` utility.

---

## 📊 Metrics Extraction

The ORBIT Lab frontend visualizes performance using native Ollama timing data, extracted at the very end of the stream.

### 1. `llm.py` Stream
As the model runs, it generates raw text, which `llm.py` parses and yields as SSE chunks:
```json
{"type": "chunk", "text": "Hello"}
```

Once Ollama sends `{"done": true}`, it attaches telemetry data. `llm.py` extracts this and calculates ms delays:
```json
{
  "type": "result",
  "metrics": {
    "eval_count": 50,
    "eval_duration": 1500000000,
    "tokens_per_sec": 33.3,
    "ttft_ms": 250,
    "load_time_ms": 100,
    "total_ms": 1850
  }
}
```

### 2. Frontend Accumulation
`arenaService.ts` parses this stream. It invokes `onChunk` for every text delta (enabling the live-typing UI) and returns the final `metrics` dict.

`ArenaWorkspace.tsx` saves this dictionary to a global `results` array in React state, which is immediately synchronized to `localStorage`.

### 3. Dashboard Visualization
The `ResultsDashboard.tsx` component receives the `results` array and binds it to `recharts`:

- **RadarChart**: Iterates through all models, mapping `Tokens/sec` (Speed), `TTFT` (Latency), and `eval_count` (Volume) to polygon vertices.
- **ComposedChart**: Uses the raw timings (`load_time_ms`, `ttft_ms`, and `eval_duration` in ms) to create stacked horizontal timelines comparing total generation lifespan across models.
