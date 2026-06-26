# pyrefly: ignore [missing-import]
from ollama import chat

from backend.modules.arena.schemas import ModelConfig
from backend.utils.llm import stream_model


def generate_response(message):
    response = chat(
        model="qwen3.5:4b",
        messages=message,
        think=False,
    )

    return response['message']['content']


def generate_stream(message, modelname, config: ModelConfig | None = None):
    import json
    for event in stream_model(modelname, message, config):
        yield f"data: {json.dumps(event)}\n\n"