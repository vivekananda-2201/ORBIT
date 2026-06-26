# pyrefly: ignore [missing-import]
from pydantic import BaseModel

class ChatRequest(BaseModel):
    modelname: str
    message : list[dict]