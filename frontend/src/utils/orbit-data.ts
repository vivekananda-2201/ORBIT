// Placeholder data for Arena and About scaffold pages.
// Chat uses real backend data; this exists for non-functional UI sections.

export type OrbitModel = {
  id: string;
  name: string;
  family: string;
  params: string;
  quant: string;
  sizeGb: number;
  accent: string;
  context: string;
  status: 'ready' | 'loaded' | 'pulling';
};

export const MODELS: OrbitModel[] = [
  {
    id: 'llama3.1:8b',
    name: 'Llama 3.1',
    family: 'Meta',
    params: '8B',
    quant: 'Q4_K_M',
    sizeGb: 4.7,
    accent: 'var(--chart-1)',
    context: '128K',
    status: 'loaded',
  },
  {
    id: 'mistral:7b',
    name: 'Mistral',
    family: 'Mistral AI',
    params: '7B',
    quant: 'Q5_K_M',
    sizeGb: 4.4,
    accent: 'var(--chart-2)',
    context: '32K',
    status: 'ready',
  },
  {
    id: 'qwen2.5:14b',
    name: 'Qwen 2.5',
    family: 'Alibaba',
    params: '14B',
    quant: 'Q4_0',
    sizeGb: 8.2,
    accent: 'var(--chart-3)',
    context: '128K',
    status: 'ready',
  },
  {
    id: 'phi3:3.8b',
    name: 'Phi-3 Mini',
    family: 'Microsoft',
    params: '3.8B',
    quant: 'Q4_K_M',
    sizeGb: 2.3,
    accent: 'var(--chart-4)',
    context: '4K',
    status: 'ready',
  },
  {
    id: 'gemma2:9b',
    name: 'Gemma 2',
    family: 'Google',
    params: '9B',
    quant: 'Q4_K_M',
    sizeGb: 5.4,
    accent: 'var(--chart-5)',
    context: '8K',
    status: 'ready',
  },
  {
    id: 'codellama:13b',
    name: 'Code Llama',
    family: 'Meta',
    params: '13B',
    quant: 'Q4_K_M',
    sizeGb: 7.4,
    accent: 'var(--chart-1)',
    context: '16K',
    status: 'pulling',
  },
];

export type BenchModelResult = {
  modelId: string;
  name: string;
  accent: string;
  tokensPerSec: number;
  ttftMs: number;
  totalMs: number;
  totalTokens: number;
  costPer1k: number;
  quality: number;
  verdict: 'fastest' | 'balanced' | 'highest-quality' | 'most-efficient';
};

export const BENCH_RESULTS: BenchModelResult[] = [
  {
    modelId: 'llama3.1:8b',
    name: 'Llama 3.1 8B',
    accent: 'var(--chart-1)',
    tokensPerSec: 62.4,
    ttftMs: 210,
    totalMs: 1840,
    totalTokens: 115,
    costPer1k: 0,
    quality: 84,
    verdict: 'balanced',
  },
  {
    modelId: 'mistral:7b',
    name: 'Mistral 7B',
    accent: 'var(--chart-2)',
    tokensPerSec: 78.1,
    ttftMs: 150,
    totalMs: 1320,
    totalTokens: 103,
    costPer1k: 0,
    quality: 79,
    verdict: 'fastest',
  },
  {
    modelId: 'qwen2.5:14b',
    name: 'Qwen 2.5 14B',
    accent: 'var(--chart-3)',
    tokensPerSec: 41.7,
    ttftMs: 320,
    totalMs: 2950,
    totalTokens: 123,
    costPer1k: 0,
    quality: 91,
    verdict: 'highest-quality',
  },
  {
    modelId: 'phi3:3.8b',
    name: 'Phi-3 Mini',
    accent: 'var(--chart-4)',
    tokensPerSec: 96.3,
    ttftMs: 90,
    totalMs: 880,
    totalTokens: 84,
    costPer1k: 0,
    quality: 71,
    verdict: 'most-efficient',
  },
];

export const THROUGHPUT_SERIES = Array.from({ length: 12 }, (_, i) => {
  const t = i * 0.25;
  return {
    t: `${t.toFixed(2)}s`,
    'llama3.1:8b': Math.round((58 + Math.sin(i / 2) * 8 + Math.random() * 4) * 10) / 10,
    'mistral:7b': Math.round((74 + Math.sin(i / 2 + 1) * 9 + Math.random() * 4) * 10) / 10,
    'qwen2.5:14b': Math.round((39 + Math.sin(i / 3) * 6 + Math.random() * 3) * 10) / 10,
    'phi3:3.8b': Math.round((92 + Math.sin(i / 2 + 2) * 10 + Math.random() * 5) * 10) / 10,
  };
});

export const QUALITY_RADAR = [
  { metric: 'Reasoning', 'llama3.1:8b': 84, 'mistral:7b': 76, 'qwen2.5:14b': 92, 'phi3:3.8b': 68 },
  { metric: 'Coding', 'llama3.1:8b': 80, 'mistral:7b': 74, 'qwen2.5:14b': 90, 'phi3:3.8b': 72 },
  { metric: 'Concision', 'llama3.1:8b': 82, 'mistral:7b': 85, 'qwen2.5:14b': 79, 'phi3:3.8b': 88 },
  { metric: 'Factuality', 'llama3.1:8b': 86, 'mistral:7b': 78, 'qwen2.5:14b': 93, 'phi3:3.8b': 70 },
  { metric: 'Creativity', 'llama3.1:8b': 81, 'mistral:7b': 80, 'qwen2.5:14b': 84, 'phi3:3.8b': 66 },
  { metric: 'Latency', 'llama3.1:8b': 74, 'mistral:7b': 88, 'qwen2.5:14b': 58, 'phi3:3.8b': 96 },
];

export const BENCH_PROMPT =
  'Write a function that returns the nth Fibonacci number using memoization, then explain its time complexity.';

export const ARENA_RESPONSES: Record<string, string> = {
  'llama3.1:8b':
    "Here's a memoized Fibonacci in Python:\n\n```python\nfrom functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef fib(n: int) -> int:\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)\n```\n\nEach value is computed once and cached, so the time complexity drops from exponential to **O(n)**, with O(n) space for the cache.",
  'mistral:7b':
    "```python\ndef fib(n, memo={}):\n    if n in memo:\n        return memo[n]\n    if n < 2:\n        return n\n    memo[n] = fib(n - 1, memo) + fib(n - 2, memo)\n    return memo[n]\n```\n\nMemoization stores results to avoid recomputation. Complexity is **O(n)** time and **O(n)** space.",
  'qwen2.5:14b':
    "Using a dictionary cache for clarity:\n\n```python\ndef fib(n, cache=None):\n    if cache is None:\n        cache = {}\n    if n in cache:\n        return cache[n]\n    result = n if n < 2 else fib(n - 1, cache) + fib(n - 2, cache)\n    cache[n] = result\n    return result\n```\n\nWithout memoization the recursion branches into ~2^n calls. Caching each subproblem reduces it to **O(n)** unique computations and **O(n)** auxiliary space (plus O(n) recursion depth).",
  'phi3:3.8b':
    "```python\ndef fib(n, memo={}):\n    if n < 2: return n\n    if n not in memo:\n        memo[n] = fib(n-1) + fib(n-2)\n    return memo[n]\n```\n\nThis is **O(n)** time and space.",
};
