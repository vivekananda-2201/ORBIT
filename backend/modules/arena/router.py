import json

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from .schemas import ArenaRequest
from backend.utils.llm import stream_model


router = APIRouter(
    prefix="/arena",
    tags=["Arena"],
)


def _arena_event_stream(request: ArenaRequest):
    """
    SSE generator: runs each model sequentially and yields JSON events.
    Events:
      - {"type": "start", "model": "..."}
      - {"type": "chunk", "model": "...", "text": "..."}
      - {"type": "result", "model": "...", "data": {...}}
      - {"type": "complete"}
    """
    models = request.models[:6]  # enforce max 6

    for model_name in models:
        # Signal that this model is starting
        start_event = json.dumps({"type": "start", "model": model_name})
        yield f"data: {start_event}\n\n"

        try:
            messages = [{"role": "user", "content": request.prompt}]
            
            for event in stream_model(
                model_name=model_name,
                messages=messages,
                config=request.config,
            ):
                if event["type"] == "chunk":
                    chunk_event = json.dumps({
                        "type": "chunk",
                        "model": model_name,
                        "text": event["text"],
                    })
                    yield f"data: {chunk_event}\n\n"
                elif event["type"] == "result":
                    result_event = json.dumps({
                        "type": "result",
                        "model": model_name,
                        "data": event["metrics"],
                    })
                    yield f"data: {result_event}\n\n"

        except Exception as e:
            error_event = json.dumps({
                "type": "error",
                "model": model_name,
                "message": str(e),
            })
            yield f"data: {error_event}\n\n"

    # Signal all models complete
    complete_event = json.dumps({"type": "complete"})
    yield f"data: {complete_event}\n\n"


@router.post("/run")
def run_arena(request: ArenaRequest):
    return StreamingResponse(
        _arena_event_stream(request),
        media_type="text/event-stream",
    )

