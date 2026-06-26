export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  metrics?: any;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

interface ModelDetails {
    parent_model: string;
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
}

export interface ModelItem {
    model: string;
    modified_at: string;
    digest: string;
    size: number;
    details: ModelDetails;
}

export interface ModelsMetaData {
    models: ModelItem[];
}

// ── Model Config (shared by Chat & Arena) ──────────────────────────

export interface ModelConfig {
    temperature?: number;
    top_p?: number;
    top_k?: number;
    num_predict?: number;
    num_ctx?: number;
    repeat_penalty?: number;
    seed?: number;
    system_prompt?: string;
}

// ── Arena Types ────────────────────────────────────────────────────

export interface ArenaModelResult {
    model: string;
    response: string;
    eval_count: number;
    eval_duration: number;
    prompt_eval_count: number;
    prompt_eval_duration: number;
    total_duration: number;
    load_duration: number;
    tokens_per_sec: number;
    ttft_ms: number;
    total_ms: number;
    load_time_ms: number;
    response_tokens: number;
    prompt_tokens: number;
}

export type ArenaRunState = 'idle' | 'running' | 'done';

export interface BenchmarkRecord {
  id: string;
  timestamp: number;
  prompt: string;
  models: string[];
  results: ArenaModelResult[];
}