# pyrefly: ignore [missing-import]
from ollama import chat

from backend.modules.arena.schemas import ModelConfig


def build_options(config: ModelConfig | None) -> dict:
    """Convert ModelConfig to ollama options dict, skipping None values."""
    if config is None:
        return {}
    opts = {}
    if config.temperature is not None:
        opts["temperature"] = config.temperature
    if config.top_p is not None:
        opts["top_p"] = config.top_p
    if config.top_k is not None:
        opts["top_k"] = config.top_k
    if config.num_predict is not None:
        opts["num_predict"] = config.num_predict
    if config.num_ctx is not None:
        opts["num_ctx"] = config.num_ctx
    if config.repeat_penalty is not None:
        opts["repeat_penalty"] = config.repeat_penalty
    if config.seed is not None:
        opts["seed"] = config.seed
    return opts


def stream_model(model_name: str, messages: list[dict], config: ModelConfig | None = None):
    """
    Generator that calls ollama.chat(stream=True) and yields two types of dicts:
    1. {"type": "chunk", "text": "..."}
    2. {"type": "result", "metrics": {...}} (yielded exactly once at the end)
    """
    # Prepend system prompt if provided
    if config and config.system_prompt:
        # Check if first message is already a system prompt
        if messages and messages[0].get("role") == "system":
            messages[0]["content"] = config.system_prompt
        else:
            messages.insert(0, {"role": "system", "content": config.system_prompt})

    options = build_options(config)
    kwargs = {
        "model": model_name,
        "messages": messages,
        "think": False,
        "stream": True,
    }
    if options:
        kwargs["options"] = options

    response = chat(**kwargs)
    
    full_text = ""
    for chunk in response:
        content = chunk.get("message", {}).get("content", "")
        if content:
            full_text += content
            yield {"type": "chunk", "text": content}
            
        if chunk.get("done"):
            # This is the final chunk that contains native timing metrics
            total_duration = chunk.get("total_duration", 0)
            load_duration = chunk.get("load_duration", 0)
            prompt_eval_count = chunk.get("prompt_eval_count", 0)
            prompt_eval_duration = chunk.get("prompt_eval_duration", 0)
            eval_count = chunk.get("eval_count", 0)
            eval_duration = chunk.get("eval_duration", 0)

            total_ms = total_duration / 1_000_000 if total_duration else 0
            load_time_ms = load_duration / 1_000_000 if load_duration else 0
            ttft_ms = prompt_eval_duration / 1_000_000 if prompt_eval_duration else 0

            if eval_duration > 0:
                tokens_per_sec = round(eval_count / (eval_duration / 1_000_000_000), 2)
            else:
                tokens_per_sec = 0.0

            yield {
                "type": "result",
                "metrics": {
                    "model": model_name,
                    "response": full_text,
                    "eval_count": eval_count,
                    "eval_duration": eval_duration,
                    "prompt_eval_count": prompt_eval_count,
                    "prompt_eval_duration": prompt_eval_duration,
                    "total_duration": total_duration,
                    "load_duration": load_duration,
                    "tokens_per_sec": tokens_per_sec,
                    "ttft_ms": round(ttft_ms, 2),
                    "total_ms": round(total_ms, 2),
                    "load_time_ms": round(load_time_ms, 2),
                    "response_tokens": eval_count,
                    "prompt_tokens": prompt_eval_count,
                }
            }
