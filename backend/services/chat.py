# pyrefly: ignore [missing-import]
from ollama import chat


def generate_response(message):
    response = chat(
        model="qwen3.5:4b",
        messages=message,
        think=False,
    )

    return response['message']['content']


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