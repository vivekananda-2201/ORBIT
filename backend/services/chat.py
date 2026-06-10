# pyrefly: ignore [missing-import]
from ollama import chat

def generate_response(message):
    response = chat(
        model = "qwen3.5:4b",
        messages = message,
        think = False
    )

    return response['message']['content']