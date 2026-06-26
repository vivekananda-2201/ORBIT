# pyrefly: ignore [missing-import]
from pydantic import BaseModel
from typing import Optional


class ModelConfig(BaseModel):
    temperature: Optional[float] = 0.7
    top_p: Optional[float] = 0.9
    top_k: Optional[int] = None
    num_predict: Optional[int] = 2048
    num_ctx: Optional[int] = 8192
    system_prompt: Optional[str] = None
    repeat_penalty: Optional[float] = None
    seed: Optional[int] = None


class ArenaRequest(BaseModel):
    prompt: str
    models: list[str]  # max 6 model names
    config: Optional[ModelConfig] = None


class ArenaModelResult(BaseModel):
    model: str
    response: str
    eval_count: int = 0           # tokens generated
    eval_duration: int = 0        # nanoseconds for eval
    prompt_eval_count: int = 0    # prompt tokens processed
    prompt_eval_duration: int = 0 # nanoseconds for prompt eval
    total_duration: int = 0       # total nanoseconds
    load_duration: int = 0        # model load nanoseconds
    tokens_per_sec: float = 0.0
    ttft_ms: float = 0.0         # time to first token (prompt eval time)
    total_ms: float = 0.0
    load_time_ms: float = 0.0
    response_tokens: int = 0
    prompt_tokens: int = 0
