from fastapi import APIRouter

from .schemas import ModelsMetaData
from .service import get_models_data


router = APIRouter(
    prefix="/modelsdata",
    tags=["ModelsData"],
)


@router.get("", response_model=ModelsMetaData)
def get_models():
    
    response = get_models_data()
    
    return {"models": response.models}