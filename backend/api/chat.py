# pyrefly: ignore [missing-import]
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.services.chat import generate_response
from backend.schemas.chat import ChatRequest

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat")
def chat_with_model(request : ChatRequest):
    response = generate_response(request.message)
    return {"response" : response}