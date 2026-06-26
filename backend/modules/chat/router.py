from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from .schemas import ChatRequest
from .service import generate_stream


router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


@router.post("")
def chat_with_model(request: ChatRequest):
    return StreamingResponse(
        generate_stream(message = request.message, modelname = request.modelname), 
        media_type="text/plain")