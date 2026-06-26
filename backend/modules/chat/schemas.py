# pyrefly: ignore [missing-import]
from pydantic import BaseModel
from typing import Optional

from backend.modules.arena.schemas import ModelConfig


class ChatRequest(BaseModel):
    modelname: str
    message: list[dict]
    config: Optional[ModelConfig] = None