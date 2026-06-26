from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.modules.chat.router import router as chat_router
from backend.modules.models.router import router as models_router
from backend.modules.arena.router import router as arena_router


app = FastAPI(
    title="ORBIT API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api/v1")
app.include_router(models_router, prefix="/api/v1")
app.include_router(arena_router, prefix="/api/v1")