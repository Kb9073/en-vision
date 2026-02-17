from pydantic import BaseModel
from datetime import datetime
from typing import Any

class StandardResponse(BaseModel):
    success: bool = True
    data: Any
    timestamp: datetime
