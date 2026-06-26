from pydantic import BaseModel
from typing import List
from datetime import datetime

class ModelDetails(BaseModel):
    parent_model: str = "" # Set default to handle empty strings
    format: str
    family: str
    families: List[str]
    parameter_size: str
    quantization_level: str

class ModelItem(BaseModel):
    model: str
    modified_at: datetime
    digest: str
    size: int
    details: ModelDetails

# This matches the root structure of your model.json
class ModelsMetaData(BaseModel):
    models: List[ModelItem]